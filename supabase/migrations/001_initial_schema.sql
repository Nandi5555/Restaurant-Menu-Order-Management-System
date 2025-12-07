-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (managed by Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    inventory_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carts table
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id)
);

-- Create cart_items table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cart_id, menu_item_id)
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
    delivery_address JSONB NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_audit table
CREATE TABLE admin_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    resource_type VARCHAR(50),
    delta JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_price ON menu_items(price);
CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_menu_item ON cart_items(menu_item_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item ON order_items(menu_item_id);
CREATE INDEX idx_admin_audit_admin ON admin_audit(admin_id);
CREATE INDEX idx_admin_audit_timestamp ON admin_audit(timestamp);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit ENABLE ROW LEVEL SECURITY;

-- Grant basic permissions to anon and authenticated roles
GRANT SELECT ON categories TO anon;
GRANT SELECT ON menu_items TO anon;
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON menu_items TO authenticated;

-- Cart policies
CREATE POLICY "Users can view own cart" ON carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON carts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own cart items" ON cart_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
);
CREATE POLICY "Users can insert own cart items" ON cart_items FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
);
CREATE POLICY "Users can update own cart items" ON cart_items FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
);
CREATE POLICY "Users can delete own cart items" ON cart_items FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
);

-- Order policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff can view all orders" ON orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('staff', 'admin')
    )
);
CREATE POLICY "Staff can update order status" ON orders FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('staff', 'admin')
    )
);

CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
);
CREATE POLICY "Staff can view all order items" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('staff', 'admin')
    )
);

-- Admin policies for menu management
CREATE POLICY "Admin can manage menu items" ON menu_items FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);
CREATE POLICY "Admin can manage categories" ON categories FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);

-- Admin audit policies
CREATE POLICY "Admin can view audit logs" ON admin_audit FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);
CREATE POLICY "Admin can create audit logs" ON admin_audit FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);

-- Insert sample data
INSERT INTO categories (name, description) VALUES
('Pizza', 'Delicious Italian pizzas with various toppings'),
('Burgers', 'Juicy burgers with premium ingredients'),
('Pasta', 'Fresh pasta dishes with authentic sauces'),
('Salads', 'Healthy and fresh salad options'),
('Beverages', 'Refreshing drinks and beverages'),
('Desserts', 'Sweet treats to complete your meal');

INSERT INTO menu_items (name, description, price, category_id, tags, is_available, inventory_count) VALUES
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and fresh basil', 299.00, (SELECT id FROM categories WHERE name = 'Pizza'), '{"vegetarian", "classic"}', true, 50),
('Pepperoni Pizza', 'Pizza topped with pepperoni slices and mozzarella cheese', 349.00, (SELECT id FROM categories WHERE name = 'Pizza'), '{"non-veg", "spicy"}', true, 40),
('Cheese Burger', 'Juicy beef patty with cheese, lettuce, tomato, and special sauce', 199.00, (SELECT id FROM categories WHERE name = 'Burgers'), '{"non-veg", "classic"}', true, 30),
('Veggie Burger', 'Plant-based patty with fresh vegetables and vegan mayo', 179.00, (SELECT id FROM categories WHERE name = 'Burgers'), '{"vegetarian", "healthy"}', true, 25),
('Spaghetti Carbonara', 'Classic Italian pasta with eggs, cheese, and pancetta', 249.00, (SELECT id FROM categories WHERE name = 'Pasta'), '{"non-veg", "creamy"}', true, 20),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing and croutons', 149.00, (SELECT id FROM categories WHERE name = 'Salads'), '{"vegetarian", "healthy"}', true, 35),
('Fresh Lemonade', 'Freshly squeezed lemon juice with mint', 79.00, (SELECT id FROM categories WHERE name = 'Beverages'), '{"fresh", "healthy"}', true, 100),
('Chocolate Lava Cake', 'Warm chocolate cake with molten center', 129.00, (SELECT id FROM categories WHERE name = 'Desserts'), '{"sweet", "chocolate"}', true, 15);
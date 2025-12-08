-- Seed additional items for production verification
-- Uses existing categories by name

INSERT INTO public.menu_items (name, description, price, category_id, tags, is_available, inventory_count, image_url)
VALUES
('Four Cheese Pizza', 'Blend of mozzarella, cheddar, parmesan, and gouda', 379.00, (SELECT id FROM public.categories WHERE name = 'Pizza'), '{"classic","cheesy"}', true, 40, 'https://images.unsplash.com/photo-1601924638867-3ec3b87a3cde?q=80&w=1080&auto=format&fit=crop'),
('BBQ Chicken Pizza', 'Smoky BBQ sauce with grilled chicken and red onions', 399.00, (SELECT id FROM public.categories WHERE name = 'Pizza'), '{"chicken","bbq"}', true, 35, 'https://images.unsplash.com/photo-1604908177078-7e36f0dd8f2b?q=80&w=1080&auto=format&fit=crop'),
('Penne Arrabbiata', 'Spicy tomato sauce with garlic and chili', 259.00, (SELECT id FROM public.categories WHERE name = 'Pasta'), '{"spicy","italian"}', true, 50, 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1080&auto=format&fit=crop'),
('Fettuccine Alfredo', 'Creamy parmesan sauce with butter', 279.00, (SELECT id FROM public.categories WHERE name = 'Pasta'), '{"creamy","vegetarian"}', true, 45, 'https://images.unsplash.com/photo-1543352634-7e54fbf7f0c6?q=80&w=1080&auto=format&fit=crop'),
('Greek Salad', 'Cucumbers, tomatoes, olives, feta, and oregano', 169.00, (SELECT id FROM public.categories WHERE name = 'Salads'), '{"fresh","healthy"}', true, 60, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1080&auto=format&fit=crop'),
('Minestrone Soup', 'Hearty Italian vegetable soup with beans', 139.00, (SELECT id FROM public.categories WHERE name = 'Soups'), '{"vegetarian","hearty"}', true, 70, 'https://images.unsplash.com/photo-1543353071-873f17a7a5d6?q=80&w=1080&auto=format&fit=crop'),
('Crispy Fries', 'Golden fries with sea salt', 99.00, (SELECT id FROM public.categories WHERE name = 'Burgers'), '{"sides","crispy"}', true, 120, 'https://images.unsplash.com/photo-1541599540903-216a46ca1ef2?q=80&w=1080&auto=format&fit=crop'),
('Iced Coffee', 'Chilled coffee over ice with milk', 89.00, (SELECT id FROM public.categories WHERE name = 'Beverages'), '{"coffee","cold"}', true, 100, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1080&auto=format&fit=crop'),
('Orange Juice', 'Freshly squeezed oranges', 79.00, (SELECT id FROM public.categories WHERE name = 'Beverages'), '{"fresh","healthy"}', true, 100, 'https://images.unsplash.com/photo-1542444459-db57b06fd5a3?q=80&w=1080&auto=format&fit=crop'),
('Tiramisu', 'Classic Italian dessert with mascarpone and espresso', 149.00, (SELECT id FROM public.categories WHERE name = 'Desserts'), '{"sweet","classic"}', true, 30, 'https://images.unsplash.com/photo-1602192107832-0b64d5853c6a?q=80&w=1080&auto=format&fit=crop');

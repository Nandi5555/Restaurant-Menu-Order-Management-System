-- Set a static image URL for Margherita Pizza
UPDATE public.menu_items
SET image_url = 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1080&auto=format&fit=crop'
WHERE lower(name) = 'margherita pizza';


-- Optional demo seed data for a richer customer storefront.
-- Safe to run multiple times: categories/products are inserted only when missing.

INSERT INTO categories (name)
VALUES
  ('Drinks'),
  ('Bakery'),
  ('Dairy'),
  ('Snacks'),
  ('Fruits & Vegetables'),
  ('Household')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT 'Sparkling Mineral Water', 'Refreshing 1.5L bottle for everyday hydration.', 1.20, 48,
       'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=80',
       (SELECT id FROM categories WHERE name = 'Drinks')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sparkling Mineral Water');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT 'Fresh Orange Juice', 'Cold pressed orange juice with no added sugar.', 2.80, 22,
       'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=900&q=80',
       (SELECT id FROM categories WHERE name = 'Drinks')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Orange Juice');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT 'Artisan Sourdough Bread', 'Crusty bakery loaf baked fresh this morning.', 2.40, 16,
       'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=900&q=80',
       (SELECT id FROM categories WHERE name = 'Bakery')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Artisan Sourdough Bread');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT 'Greek Yogurt', 'Creamy plain yogurt, perfect for breakfast bowls.', 1.90, 34,
       'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
       (SELECT id FROM categories WHERE name = 'Dairy')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Greek Yogurt');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT 'Farm Milk 1L', 'Fresh whole milk from local farms.', 1.35, 40,
       'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80',
       (SELECT id FROM categories WHERE name = 'Dairy')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Farm Milk 1L');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT 'Sea Salt Potato Chips', 'Crunchy family-size snack with sea salt.', 1.75, 12,
       'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=900&q=80',
       (SELECT id FROM categories WHERE name = 'Snacks')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sea Salt Potato Chips');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT 'Fresh Bananas', 'Sweet ripe bananas sold by the bunch.', 1.10, 55,
       'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=80',
       (SELECT id FROM categories WHERE name = 'Fruits & Vegetables')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Bananas');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT 'Cherry Tomatoes', 'Juicy tomatoes for salads and quick dinners.', 2.25, 8,
       'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80',
       (SELECT id FROM categories WHERE name = 'Fruits & Vegetables')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cherry Tomatoes');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT 'Dish Soap Lemon', 'Powerful grease-cutting dish soap with lemon scent.', 2.60, 18,
       'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=900&q=80',
       (SELECT id FROM categories WHERE name = 'Household')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dish Soap Lemon');

INSERT INTO products (name, description, price, stock, image_url, category_id)
SELECT 'Paper Towels 2-Pack', 'Absorbent paper towels for kitchen cleanup.', 3.10, 0,
       'https://images.unsplash.com/photo-1583947581924-a31d2fa6c3cc?auto=format&fit=crop&w=900&q=80',
       (SELECT id FROM categories WHERE name = 'Household')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Paper Towels 2-Pack');

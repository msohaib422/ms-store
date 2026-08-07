
/*
# M.S. Store – Full Schema

1. New Tables
  - `categories` – product categories with image, banner, slug, order
  - `products` – full product model with pricing, images, flags
  - `offers` – promotional offers with banner + expiry
  - `reviews` – customer reviews with approval system
  - `messages` – contact form submissions
  - `gallery` – gallery images managed by admin
  - `settings` – key/value site settings (name, logo, social links, etc.)

2. Security
  - RLS enabled on all tables
  - Public (anon + authenticated) SELECT on products, categories, offers, reviews, gallery, settings
  - Public INSERT on messages and reviews
  - Authenticated-only INSERT/UPDATE/DELETE for admin operations
  - Settings readable by everyone, writable only by authenticated
*/

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  banner_url text,
  display_order integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_categories" ON categories;
CREATE POLICY "public_select_categories" ON categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories FOR DELETE TO authenticated USING (true);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  discount_price numeric(10,2),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  brand text,
  sku text,
  stock integer DEFAULT 0,
  images text[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_featured boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  is_offer boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  ratings numeric(3,2) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  search_keywords text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(is_trending);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products" ON products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE TO authenticated USING (true);

-- OFFERS
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  banner_url text,
  discount_percentage numeric(5,2) DEFAULT 0,
  badge_text text,
  expiry_date timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_offers" ON offers;
CREATE POLICY "public_select_offers" ON offers FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_offers" ON offers;
CREATE POLICY "admin_insert_offers" ON offers FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_offers" ON offers;
CREATE POLICY "admin_update_offers" ON offers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_offers" ON offers;
CREATE POLICY "admin_delete_offers" ON offers FOR DELETE TO authenticated USING (true);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_reviews" ON reviews;
CREATE POLICY "public_select_reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_reviews" ON reviews;
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_reviews" ON reviews;
CREATE POLICY "admin_update_reviews" ON reviews FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_reviews" ON reviews;
CREATE POLICY "admin_delete_reviews" ON reviews FOR DELETE TO authenticated USING (true);

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_messages" ON messages;
CREATE POLICY "public_insert_messages" ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_messages" ON messages;
CREATE POLICY "admin_select_messages" ON messages FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_messages" ON messages;
CREATE POLICY "admin_update_messages" ON messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_messages" ON messages;
CREATE POLICY "admin_delete_messages" ON messages FOR DELETE TO authenticated USING (true);

-- GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_gallery" ON gallery;
CREATE POLICY "public_select_gallery" ON gallery FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_gallery" ON gallery;
CREATE POLICY "admin_insert_gallery" ON gallery FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_gallery" ON gallery;
CREATE POLICY "admin_update_gallery" ON gallery FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_gallery" ON gallery;
CREATE POLICY "admin_delete_gallery" ON gallery FOR DELETE TO authenticated USING (true);

-- SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_settings" ON settings;
CREATE POLICY "public_select_settings" ON settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_settings" ON settings;
CREATE POLICY "admin_insert_settings" ON settings FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_settings" ON settings;
CREATE POLICY "admin_update_settings" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Seed default settings
INSERT INTO settings (key, value) VALUES
  ('store_name', 'M.S. Store'),
  ('store_tagline', 'Your Trusted Shopping Destination'),
  ('store_description', 'We offer a wide range of quality products at the best prices.'),
  ('phone', '03046428782'),
  ('whatsapp', '03249503305'),
  ('email', 'www.msohaib422@gmail.com'),
  ('address', 'Pakistan'),
  ('business_hours', 'Mon - Sat: 9:00 AM - 9:00 PM'),
  ('facebook', ''),
  ('instagram', ''),
  ('twitter', ''),
  ('youtube', ''),
  ('logo_url', ''),
  ('hero_title', 'Quality Products, Unbeatable Prices'),
  ('hero_subtitle', 'Discover our wide range of premium products curated just for you'),
  ('map_embed', '')
ON CONFLICT (key) DO NOTHING;

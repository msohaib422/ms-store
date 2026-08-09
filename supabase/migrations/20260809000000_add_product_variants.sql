-- Add variants column to products table
-- Variants store multiple price options as JSONB array
-- Example: [{"name": "250g", "price": 50, "discountPrice": 45}, {"name": "500g", "price": 100, "discountPrice": 90}]

ALTER TABLE products ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]'::jsonb;

-- Migrate existing products: create a single variant from current price/discount_price
-- This ensures backward compatibility with products that already have data
UPDATE products
SET variants = jsonb_build_array(
  jsonb_build_object(
    'name', COALESCE(sku, 'Default'),
    'price', price,
    'discountPrice', discount_price
  )
)
WHERE variants = '[]'::jsonb AND price > 0;

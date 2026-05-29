-- Adds optional map-based delivery location fields.
-- Safe for existing data: all columns are nullable and existing address data remains unchanged.

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_latitude NUMERIC(10, 7);

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_longitude NUMERIC(10, 7);

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_address TEXT;

UPDATE orders
SET delivery_address = address
WHERE delivery_address IS NULL;

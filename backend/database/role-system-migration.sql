-- Role-based delivery workflow migration.
-- Run this once against an existing database. It is additive and keeps existing rows.

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS courier_id INT REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(30) DEFAULT 'not_assigned';

DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'orders'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%status%pending%';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE orders DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

ALTER TABLE orders
ADD CONSTRAINT orders_status_check
CHECK (status IN (
  'pending',
  'accepted',
  'preparing',
  'assigned_to_courier',
  'delivered',
  'cancelled'
));

ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_delivery_status_check;

ALTER TABLE orders
ADD CONSTRAINT orders_delivery_status_check
CHECK (delivery_status IN (
  'not_assigned',
  'assigned',
  'picked_up',
  'on_the_way',
  'delivered'
));

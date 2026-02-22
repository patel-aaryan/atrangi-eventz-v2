DROP TRIGGER IF EXISTS validate_order_number_format_trigger ON orders;
DROP FUNCTION IF EXISTS validate_order_number_format();

DROP TRIGGER IF EXISTS generate_order_number_trigger ON orders;
DROP FUNCTION IF EXISTS generate_order_number();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

DROP TABLE IF EXISTS orders CASCADE;
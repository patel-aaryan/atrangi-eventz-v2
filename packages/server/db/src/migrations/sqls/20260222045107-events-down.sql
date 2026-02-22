DROP TRIGGER IF EXISTS validate_ticket_tiers_trigger ON events;
DROP FUNCTION IF EXISTS validate_ticket_tiers();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;

DROP TABLE IF EXISTS events CASCADE;

DROP TYPE IF EXISTS ticket_status;
DROP TYPE IF EXISTS order_status;
DROP TYPE IF EXISTS event_status;

DROP FUNCTION IF EXISTS update_updated_at_column();
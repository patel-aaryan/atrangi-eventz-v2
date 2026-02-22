DROP TRIGGER IF EXISTS update_event_ticket_counts_trigger ON tickets;
DROP FUNCTION IF EXISTS update_event_ticket_counts();

DROP TRIGGER IF EXISTS generate_ticket_code_trigger ON tickets;
DROP FUNCTION IF EXISTS generate_ticket_code();

DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;

DROP TABLE IF EXISTS tickets CASCADE;
DROP TRIGGER IF EXISTS update_supported_events_updated_at ON supported_events;
DROP TABLE IF EXISTS supported_events CASCADE;

DROP TRIGGER IF EXISTS update_sponsors_updated_at ON sponsors;
DROP TABLE IF EXISTS sponsors CASCADE;
-- Revoke all privileges first to start from a clean slate
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM web;

-- Public read access for web app display
GRANT SELECT ON TABLE events, sponsors, supported_events TO web;

-- Required permissions for the checkout flow and order history
GRANT SELECT, INSERT, UPDATE ON TABLE orders, tickets TO web;

-- Required for the ticket purchase trigger to update ticket counts
GRANT UPDATE ON TABLE events TO web;
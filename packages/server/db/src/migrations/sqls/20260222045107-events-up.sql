
-- UTILITY FUNCTIONS & ENUMS
---------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE ticket_status AS ENUM ('pending', 'confirmed', 'checked_in');

-- EVENTS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    
    -- Event timing
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    ticket_sales_open TIMESTAMP WITH TIME ZONE,
    ticket_sales_close TIMESTAMP WITH TIME ZONE,
    
    -- Location details
    venue_name VARCHAR(255),
    venue_address TEXT,
    venue_city VARCHAR(100),
    venue_province VARCHAR(100) DEFAULT 'Ontario',
    venue_postal_code VARCHAR(20),
    venue_country VARCHAR(100) DEFAULT 'Canada',
    
    -- Event details
    total_capacity INTEGER,
    total_tickets_sold INTEGER DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'CAD',
    total_revenue DECIMAL(12, 2) DEFAULT 0.00,
    num_sponsors INTEGER DEFAULT 0,
    num_volunteers INTEGER DEFAULT 0,
    rules TEXT,
    
    -- Ticket tiers 
    ticket_tiers JSONB DEFAULT '[]'::jsonb,
    
    -- Computed fields
    is_sold_out BOOLEAN GENERATED ALWAYS AS (total_tickets_sold >= total_capacity) STORED,
    
    -- Media (Images moved to URLs)
    banner_image_url TEXT,
    album_url TEXT,
    
    -- Status and visibility
    status event_status DEFAULT 'draft',
    is_public BOOLEAN DEFAULT true,
    
    -- SEO and metadata
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_ticket_sales_dates CHECK (ticket_sales_close IS NULL OR ticket_sales_open IS NULL OR ticket_sales_close >= ticket_sales_open),
    CONSTRAINT valid_capacity CHECK (total_capacity > 0),
    CONSTRAINT valid_tickets_sold CHECK (total_tickets_sold >= 0 AND total_tickets_sold <= total_capacity)
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_start_date ON events(start_date DESC);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_ticket_tiers ON events USING GIN(ticket_tiers);
CREATE INDEX idx_events_status_start_date ON events(status, start_date DESC);

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION validate_ticket_tiers()
RETURNS TRIGGER AS $$
BEGIN
    IF jsonb_typeof(NEW.ticket_tiers) != 'array' THEN
        RAISE EXCEPTION 'ticket_tiers must be a JSON array';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_ticket_tiers_trigger
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION validate_ticket_tiers();
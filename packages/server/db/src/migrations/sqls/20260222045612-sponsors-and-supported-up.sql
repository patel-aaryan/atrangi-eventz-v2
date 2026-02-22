-- 5. SPONSORS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    website_url TEXT,
    image_url TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sponsors_company_name ON sponsors(company_name);

CREATE TRIGGER update_sponsors_updated_at
    BEFORE UPDATE ON sponsors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. SUPPORTED EVENTS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS supported_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    social_url TEXT,
    event_date DATE NOT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supported_events_name ON supported_events(name);
CREATE INDEX idx_supported_events_event_date ON supported_events(event_date DESC);

CREATE TRIGGER update_supported_events_updated_at
    BEFORE UPDATE ON supported_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

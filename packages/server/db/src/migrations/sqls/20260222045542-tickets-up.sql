-- TICKETS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Event relationship
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    -- Order information 
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE, 
    order_number VARCHAR(50) NOT NULL, 
    
    -- Order-level financial data 
    order_subtotal DECIMAL(10, 2) NOT NULL, 
    order_discount DECIMAL(10, 2) DEFAULT 0.00, 
    order_processing_fee DECIMAL(10, 2) DEFAULT 0.00, 
    order_total DECIMAL(10, 2) NOT NULL, 
    
    -- Ticket tier information 
    tier_name VARCHAR(255) NOT NULL, 
    tier_index INTEGER NOT NULL, 
    price_at_purchase DECIMAL(10, 2) NOT NULL, 
    
    -- Attendee information
    attendee_first_name VARCHAR(255) NOT NULL,
    attendee_last_name VARCHAR(255) NOT NULL,
    
    -- Buyer/Contact information
    buyer_first_name VARCHAR(255) NOT NULL,
    buyer_last_name VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(50),
    
    -- Billing information
    billing_zip VARCHAR(20), 
    billing_address TEXT, 
    
    -- Ticket identification
    ticket_code VARCHAR(50) UNIQUE NOT NULL, 
    qr_code_data TEXT, 
    
    -- Payment information
    amount_paid DECIMAL(10, 2) NOT NULL, 
    currency VARCHAR(3) DEFAULT 'CAD',
    
    -- Stripe payment tracking 
    stripe_payment_intent_id VARCHAR(255), 
    stripe_charge_id VARCHAR(255), 
    stripe_payment_method_id VARCHAR(255), 
    payment_status VARCHAR(50), 
    
    -- Status and tracking
    status ticket_status DEFAULT 'pending',
    is_checked_in BOOLEAN DEFAULT false,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_price CHECK (amount_paid >= 0),
    CONSTRAINT valid_tier_index CHECK (tier_index >= 0),
    CONSTRAINT valid_order_subtotal CHECK (order_subtotal >= 0),
    CONSTRAINT valid_order_discount CHECK (order_discount >= 0),
    CONSTRAINT valid_order_processing_fee CHECK (order_processing_fee >= 0),
    CONSTRAINT valid_order_total CHECK (order_total >= 0),
    CONSTRAINT fk_tickets_order_number FOREIGN KEY (order_id, order_number) REFERENCES orders(id, order_number) ON DELETE CASCADE
);

CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_order_id ON tickets(order_id);
CREATE INDEX idx_tickets_order_number ON tickets(order_number);
CREATE INDEX idx_tickets_ticket_code ON tickets(ticket_code);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_stripe_payment_intent ON tickets(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX idx_tickets_stripe_charge ON tickets(stripe_charge_id) WHERE stripe_charge_id IS NOT NULL;
CREATE INDEX idx_tickets_payment_status ON tickets(payment_status) WHERE payment_status IS NOT NULL;
CREATE INDEX idx_tickets_buyer_email ON tickets(buyer_email);
CREATE INDEX idx_tickets_purchased_at ON tickets(purchased_at DESC);
CREATE INDEX idx_tickets_event_status ON tickets(event_id, status);
CREATE INDEX idx_tickets_order_status ON tickets(order_id, status);

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TRIGGER AS $$
DECLARE
    event_year INTEGER;
    random_suffix VARCHAR(10);
    base_code VARCHAR(50);
    counter INTEGER := 0;
BEGIN
    IF NEW.ticket_code IS NOT NULL AND NEW.ticket_code != '' THEN
        RETURN NEW;
    END IF;
    
    SELECT EXTRACT(YEAR FROM start_date) INTO event_year
    FROM events
    WHERE id = NEW.event_id;
    
    LOOP
        random_suffix := UPPER(
            SUBSTRING(
                MD5(RANDOM()::TEXT || NEW.id::TEXT || CURRENT_TIMESTAMP::TEXT || counter::TEXT),
                1,
                5
            )
        );
        
        base_code := 'AE-' || event_year || '-' || random_suffix;
        
        IF NOT EXISTS (SELECT 1 FROM tickets WHERE ticket_code = base_code) THEN
            NEW.ticket_code := base_code;
            EXIT;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Failed to generate unique ticket code after 100 attempts';
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_ticket_code_trigger
    BEFORE INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_code();

-- TICKET PURCHASE TRIGGER (Updates event tickets remaining and sold)
CREATE OR REPLACE FUNCTION update_event_ticket_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment total_tickets_sold for the event
    UPDATE events 
    SET total_tickets_sold = total_tickets_sold + 1
    WHERE id = NEW.event_id;

    -- Decrement the remaining count for the specific tier in ticket_tiers JSONB
    UPDATE events
    SET ticket_tiers = jsonb_set(
        ticket_tiers,
        ARRAY[NEW.tier_index::text, 'remaining'],
        (GREATEST(0, COALESCE((ticket_tiers->NEW.tier_index->>'remaining')::integer, 0) - 1))::text::jsonb
    )
    WHERE id = NEW.event_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_ticket_counts_trigger
    AFTER INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_event_ticket_counts();

-- ORDERS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Order identification
    order_number VARCHAR(50) UNIQUE NOT NULL, 
    
    -- Financial data
    subtotal DECIMAL(10, 2) NOT NULL, 
    discount DECIMAL(10, 2) DEFAULT 0.00, 
    processing_fee DECIMAL(10, 2) DEFAULT 0.00, 
    total DECIMAL(10, 2) NOT NULL, 
    currency VARCHAR(3) DEFAULT 'CAD',
    
    -- Buyer/Contact information 
    buyer_first_name VARCHAR(255) NOT NULL,
    buyer_last_name VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(50),
    
    -- Billing information
    billing_zip VARCHAR(20), 
    billing_address TEXT, 
    
    -- Promo code
    promo_code VARCHAR(50),
    discount_amount DECIMAL(10, 2) DEFAULT 0.00, 
    
    -- Stripe payment tracking
    stripe_payment_intent_id VARCHAR(255), 
    stripe_charge_id VARCHAR(255), 
    stripe_payment_method_id VARCHAR(255), 
    payment_status VARCHAR(50), 
    
    -- Status and tracking
    status order_status DEFAULT 'pending',
    
    -- Timestamps
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_subtotal CHECK (subtotal >= 0),
    CONSTRAINT valid_discount CHECK (discount >= 0),
    CONSTRAINT valid_processing_fee CHECK (processing_fee >= 0),
    CONSTRAINT valid_total CHECK (total >= 0),
    CONSTRAINT valid_discount_amount CHECK (discount_amount >= 0),
    CONSTRAINT valid_total_calculation CHECK (
        ABS(total - (subtotal - discount + processing_fee)) < 0.01
    )
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE UNIQUE INDEX idx_orders_id_order_number ON orders(id, order_number);
CREATE INDEX idx_orders_buyer_email ON orders(buyer_email);
CREATE INDEX idx_orders_purchased_at ON orders(purchased_at DESC);
CREATE INDEX idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX idx_orders_stripe_charge ON orders(stripe_charge_id) WHERE stripe_charge_id IS NOT NULL;
CREATE INDEX idx_orders_payment_status ON orders(payment_status) WHERE payment_status IS NOT NULL;
CREATE INDEX idx_orders_status_purchased_at ON orders(status, purchased_at DESC);

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    current_year INTEGER;
    random_suffix VARCHAR(10);
    base_number VARCHAR(50);
    counter INTEGER := 0;
BEGIN
    IF NEW.order_number IS NOT NULL AND NEW.order_number != '' THEN
        RETURN NEW;
    END IF;
    
    current_year := EXTRACT(YEAR FROM CURRENT_TIMESTAMP);
    
    LOOP
        random_suffix := UPPER(
            SUBSTRING(
                MD5(RANDOM()::TEXT || NEW.id::TEXT || CURRENT_TIMESTAMP::TEXT || counter::TEXT),
                1,
                6
            )
        );
        
        base_number := 'ATR-' || current_year || '-' || random_suffix;
        
        IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = base_number) THEN
            NEW.order_number := base_number;
            EXIT;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Failed to generate unique order number after 100 attempts';
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

CREATE OR REPLACE FUNCTION validate_order_number_format()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number !~ '^ATR-\d{4}-[A-Z0-9]{6}$' THEN
        RAISE EXCEPTION 'order_number must match format ATR-YYYY-XXXXXX';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_order_number_format_trigger
    BEFORE INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION validate_order_number_format();
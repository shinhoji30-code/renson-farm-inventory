/**
 * RENSON FARM INVENTORY - SUPABASE SQL SETUP SCRIPT
 * 
 * INSTRUCTIONS:
 * 1. Go to your Supabase project dashboard
 * 2. Click on "SQL Editor" in the left sidebar
 * 3. Click "New Query"
 * 4. Copy and paste this entire script
 * 5. Click "Run" button
 * 6. All tables, indexes, and policies will be created automatically
 */

-- ==================== CREATE RECEIPTS TABLE ====================
CREATE TABLE IF NOT EXISTS public.receipts (
    id BIGSERIAL PRIMARY KEY,
    receipt_date DATE NOT NULL,
    details TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    image_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== CREATE INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_receipts_receipt_date ON public.receipts(receipt_date);
CREATE INDEX IF NOT EXISTS idx_receipts_category ON public.receipts(category);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON public.receipts(created_at);
CREATE INDEX IF NOT EXISTS idx_receipts_details ON public.receipts USING GIN (to_tsvector('english', details));

-- ==================== ROW LEVEL SECURITY ====================
-- Enable RLS
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT - Allow all authenticated users and anonymous users
CREATE POLICY IF NOT EXISTS "Allow read access to all" ON public.receipts
    FOR SELECT
    USING (true);

-- Create policy for INSERT - Allow all authenticated users and anonymous users
CREATE POLICY IF NOT EXISTS "Allow insert to receipts" ON public.receipts
    FOR INSERT
    WITH CHECK (true);

-- Create policy for UPDATE - Allow all authenticated users and anonymous users
CREATE POLICY IF NOT EXISTS "Allow update to receipts" ON public.receipts
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Create policy for DELETE - Allow all authenticated users and anonymous users
CREATE POLICY IF NOT EXISTS "Allow delete receipts" ON public.receipts
    FOR DELETE
    USING (true);

-- ==================== STORAGE BUCKET ====================
-- Insert storage bucket for receipts (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- ==================== STORAGE POLICIES ====================
-- Create policy for storage - Allow public read access
CREATE POLICY IF NOT EXISTS "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'receipts');

-- Create policy for storage - Allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Allow uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'receipts');

-- Create policy for storage - Allow deletion
CREATE POLICY IF NOT EXISTS "Allow delete" ON storage.objects
    FOR DELETE USING (bucket_id = 'receipts');

-- ==================== SAMPLE DATA (OPTIONAL) ====================
-- Uncomment the lines below to add sample data for testing

-- INSERT INTO public.receipts (receipt_date, details, category, amount, created_at)
-- VALUES 
--     ('2026-09-01', 'Purchase of chicken feeds', 'Feeds', 2500.00, NOW()),
--     ('2026-09-03', 'Diesel for tractor', 'Fuel', 1800.00, NOW()),
--     ('2026-09-05', 'Fertilizer and seeds', 'Farm Supplies', 3200.00, NOW()),
--     ('2026-09-07', 'Maintenance - pump repair', 'Maintenance', 1200.00, NOW()),
--     ('2026-09-09', 'Electrical supplies', 'Utilities', 950.00, NOW());

-- ==================== VERIFY SETUP ====================
-- Run this query to verify the setup was successful:
-- SELECT COUNT(*) as receipt_count FROM public.receipts;
-- SELECT name FROM storage.buckets WHERE id = 'receipts';
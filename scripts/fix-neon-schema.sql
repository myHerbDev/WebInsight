-- Add missing columns to the website_analyses table
ALTER TABLE website_analyses 
ADD COLUMN IF NOT EXISTS server_location TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS subdomains JSONB DEFAULT '[]'::jsonb;

-- Update the table structure to match the expected schema
CREATE INDEX IF NOT EXISTS idx_website_analyses_server_location ON website_analyses(server_location);
CREATE INDEX IF NOT EXISTS idx_website_analyses_ip_address ON website_analyses(ip_address);

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'website_analyses' 
ORDER BY ordinal_position;

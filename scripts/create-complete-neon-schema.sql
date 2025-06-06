-- Drop and recreate the website_analyses table with complete schema
DROP TABLE IF EXISTS website_analyses CASCADE;

-- Create the complete website_analyses table
CREATE TABLE website_analyses (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    summary TEXT,
    key_points JSONB DEFAULT '[]'::jsonb,
    keywords JSONB DEFAULT '[]'::jsonb,
    sustainability_score INTEGER DEFAULT 0,
    performance_score INTEGER DEFAULT 0,
    script_optimization_score INTEGER DEFAULT 0,
    content_quality_score INTEGER DEFAULT 0,
    security_score INTEGER DEFAULT 0,
    improvements JSONB DEFAULT '[]'::jsonb,
    content_stats JSONB DEFAULT '{}'::jsonb,
    raw_data JSONB DEFAULT '{}'::jsonb,
    hosting_provider_name TEXT,
    ssl_certificate BOOLEAN DEFAULT false,
    server_location TEXT,
    ip_address TEXT,
    subdomains JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_website_analyses_url ON website_analyses(url);
CREATE INDEX idx_website_analyses_created_at ON website_analyses(created_at DESC);
CREATE INDEX idx_website_analyses_sustainability_score ON website_analyses(sustainability_score);
CREATE INDEX idx_website_analyses_performance_score ON website_analyses(performance_score);
CREATE INDEX idx_website_analyses_hosting_provider ON website_analyses(hosting_provider_name);

-- Create generated_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS generated_content (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    analysis_id TEXT REFERENCES website_analyses(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL,
    tone TEXT DEFAULT 'professional',
    title TEXT,
    content TEXT NOT NULL,
    markdown TEXT,
    word_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0,
    sections JSONB DEFAULT '{}'::jsonb,
    website_url TEXT,
    user_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for generated_content
CREATE INDEX IF NOT EXISTS idx_generated_content_analysis_id ON generated_content(analysis_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_created_at ON generated_content(created_at DESC);

-- Verify tables exist
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('website_analyses', 'generated_content')
ORDER BY table_name, ordinal_position;

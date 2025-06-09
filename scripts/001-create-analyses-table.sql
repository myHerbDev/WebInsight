-- Create website_analyses table
CREATE TABLE IF NOT EXISTS website_analyses (
    id VARCHAR(255) PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    summary TEXT,
    data_json JSONB, -- Store all analysis data as JSONB for flexibility
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on URL for faster lookups
CREATE INDEX IF NOT EXISTS idx_website_analyses_url ON website_analyses(url);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_website_analyses_created_at ON website_analyses(created_at DESC);

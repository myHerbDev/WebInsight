-- Create generated_content table
CREATE TABLE IF NOT EXISTS generated_content (
    id VARCHAR(255) PRIMARY KEY,
    analysis_id VARCHAR(255) REFERENCES website_analyses(id) ON DELETE SET NULL, -- Link to an analysis (optional)
    user_id VARCHAR(255), -- For future user-specific content
    content_type VARCHAR(100) NOT NULL,
    tone VARCHAR(50),
    title TEXT,
    summary TEXT,
    content TEXT, -- Full plain text content
    markdown_content TEXT, -- Full markdown content
    data_json JSONB, -- Store all structured content data
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on analysis_id
CREATE INDEX IF NOT EXISTS idx_generated_content_analysis_id ON generated_content(analysis_id);

-- Create an index on user_id (for future use)
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);

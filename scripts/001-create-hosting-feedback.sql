-- Create hosting_feedback table
CREATE TABLE IF NOT EXISTS website_analyzer.hosting_feedback (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER NOT NULL REFERENCES website_analyzer.hosting_providers(id) ON DELETE CASCADE,
    user_id VARCHAR(255), -- Can be NULL if anonymous feedback is allowed, or link to a users table
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION website_analyzer.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function before update
CREATE TRIGGER update_hosting_feedback_modtime
    BEFORE UPDATE ON website_analyzer.hosting_feedback
    FOR EACH ROW
    EXECUTE FUNCTION website_analyzer.update_modified_column();

-- Optional: Add an average_rating column to hosting_providers
-- ALTER TABLE website_analyzer.hosting_providers
-- ADD COLUMN IF NOT EXISTS average_rating NUMERIC(2, 1) DEFAULT NULL;

-- Optional: Add a feedback_count column to hosting_providers
-- ALTER TABLE website_analyzer.hosting_providers
-- ADD COLUMN IF NOT EXISTS feedback_count INTEGER DEFAULT 0;

-- Index for faster querying
CREATE INDEX IF NOT EXISTS idx_hosting_feedback_provider_id ON website_analyzer.hosting_feedback(provider_id);
CREATE INDEX IF NOT EXISTS idx_hosting_feedback_user_id ON website_analyzer.hosting_feedback(user_id);

COMMENT ON TABLE website_analyzer.hosting_feedback IS 'Stores user feedback and ratings for hosting providers.';
COMMENT ON COLUMN website_analyzer.hosting_feedback.user_id IS 'Identifier for the user who submitted the feedback. Can be from an auth system.';
COMMENT ON COLUMN website_analyzer.hosting_feedback.rating IS 'User rating from 1 to 5.';

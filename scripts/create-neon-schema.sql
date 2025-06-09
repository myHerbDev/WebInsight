-- Create the main database schema for Neon PostgreSQL

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(32) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website analyses table
CREATE TABLE IF NOT EXISTS website_analyses (
    id VARCHAR(32) PRIMARY KEY,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated content table
CREATE TABLE IF NOT EXISTS generated_content (
    id VARCHAR(32) PRIMARY KEY,
    analysis_id VARCHAR(32) REFERENCES website_analyses(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL,
    tone TEXT DEFAULT 'professional',
    title TEXT,
    content TEXT NOT NULL,
    markdown TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exports table
CREATE TABLE IF NOT EXISTS exports (
    id VARCHAR(32) PRIMARY KEY,
    analysis_id VARCHAR(32) REFERENCES website_analyses(id) ON DELETE CASCADE,
    export_format TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hosting providers table
CREATE TABLE IF NOT EXISTS hosting_providers (
    id VARCHAR(32) PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    website TEXT,
    sustainability_score INTEGER DEFAULT 0,
    performance_rating INTEGER DEFAULT 0,
    green_energy BOOLEAN DEFAULT false,
    carbon_neutral BOOLEAN DEFAULT false,
    renewable_energy_percentage INTEGER DEFAULT 0,
    data_center_locations JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    pricing_model TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comparisons table
CREATE TABLE IF NOT EXISTS comparisons (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    analysis_ids JSONB NOT NULL,
    comparison_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User saved analyses
CREATE TABLE IF NOT EXISTS saved_analyses (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) REFERENCES users(id) ON DELETE CASCADE,
    analysis_id VARCHAR(32) REFERENCES website_analyses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, analysis_id)
);

-- User favorites
CREATE TABLE IF NOT EXISTS favorites (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) REFERENCES users(id) ON DELETE CASCADE,
    analysis_id VARCHAR(32) REFERENCES website_analyses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, analysis_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_analyses_url ON website_analyses(url);
CREATE INDEX IF NOT EXISTS idx_website_analyses_created_at ON website_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_content_analysis_id ON generated_content(analysis_id);
CREATE INDEX IF NOT EXISTS idx_saved_analyses_user_id ON saved_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample hosting providers
INSERT INTO hosting_providers (id, name, website, sustainability_score, performance_rating, green_energy, carbon_neutral, renewable_energy_percentage, data_center_locations, certifications, pricing_model, features) VALUES
('hp1', 'Vercel', 'https://vercel.com', 95, 98, true, true, 100, '["Global Edge Network", "US", "EU", "Asia"]', '["Carbon Neutral", "Green Web Foundation"]', 'Pay-as-you-go', '["Edge Functions", "Automatic HTTPS", "Global CDN", "Zero Config"]'),
('hp2', 'Netlify', 'https://netlify.com', 90, 95, true, true, 85, '["US", "EU", "Asia-Pacific"]', '["Carbon Neutral", "B Corp Certified"]', 'Freemium', '["Continuous Deployment", "Form Handling", "Split Testing", "Edge Functions"]'),
('hp3', 'Cloudflare Pages', 'https://pages.cloudflare.com', 92, 97, true, true, 90, '["Global Network", "200+ Cities"]', '["RE100", "Carbon Neutral"]', 'Pay-as-you-go', '["Global CDN", "DDoS Protection", "Workers", "Analytics"]'),
('hp4', 'GitHub Pages', 'https://pages.github.com', 85, 88, true, false, 75, '["US", "EU"]', '["Carbon Neutral by 2030"]', 'Free', '["Jekyll Support", "Custom Domains", "HTTPS", "Version Control"]'),
('hp5', 'AWS Amplify', 'https://aws.amazon.com/amplify', 80, 92, true, true, 65, '["Global", "25+ Regions"]', '["Carbon Neutral by 2040"]', 'Pay-as-you-go', '["Full-Stack Deployment", "CI/CD", "Monitoring", "Authentication"]')
ON CONFLICT (name) DO NOTHING;

-- Setup script for Supabase Purple Book project
-- WebInSight Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create website_analyses table
CREATE TABLE IF NOT EXISTS website_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    title TEXT,
    summary TEXT,
    performance_score INTEGER DEFAULT 0,
    sustainability_score INTEGER DEFAULT 0,
    security_score INTEGER DEFAULT 0,
    content_quality_score INTEGER DEFAULT 0,
    script_optimization_score INTEGER DEFAULT 0,
    key_points TEXT[],
    keywords TEXT[],
    improvements TEXT[],
    hosting_provider_name TEXT,
    ssl_certificate BOOLEAN DEFAULT false,
    server_location TEXT,
    ip_address TEXT,
    subdomains TEXT[],
    content_stats JSONB,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated_content table
CREATE TABLE IF NOT EXISTS generated_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES website_analyses(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    markdown TEXT,
    summary TEXT,
    key_points TEXT[],
    tone TEXT DEFAULT 'professional',
    word_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0,
    sections JSONB,
    website_url TEXT,
    user_id TEXT,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hosting_providers table
CREATE TABLE IF NOT EXISTS hosting_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    sustainability_score INTEGER DEFAULT 0,
    green_energy BOOLEAN DEFAULT false,
    carbon_neutral BOOLEAN DEFAULT false,
    renewable_energy_percentage INTEGER DEFAULT 0,
    data_center_efficiency DECIMAL(3,2),
    certifications TEXT[],
    description TEXT,
    website_url TEXT,
    pricing_info JSONB,
    features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free',
    api_usage_count INTEGER DEFAULT 0,
    api_usage_limit INTEGER DEFAULT 100,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_analyses table
CREATE TABLE IF NOT EXISTS saved_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES website_analyses(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, analysis_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES website_analyses(id) ON DELETE CASCADE,
    favorited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, analysis_id)
);

-- Create comparisons table
CREATE TABLE IF NOT EXISTS comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    analysis_ids UUID[],
    comparison_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_analyses_url ON website_analyses(url);
CREATE INDEX IF NOT EXISTS idx_website_analyses_created_at ON website_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_analyses_performance_score ON website_analyses(performance_score DESC);
CREATE INDEX IF NOT EXISTS idx_website_analyses_sustainability_score ON website_analyses(sustainability_score DESC);

CREATE INDEX IF NOT EXISTS idx_generated_content_analysis_id ON generated_content(analysis_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_content_type ON generated_content(content_type);
CREATE INDEX IF NOT EXISTS idx_generated_content_created_at ON generated_content(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_hosting_providers_name ON hosting_providers(name);
CREATE INDEX IF NOT EXISTS idx_hosting_providers_sustainability_score ON hosting_providers(sustainability_score DESC);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_saved_analyses_user_id ON saved_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_user_id ON comparisons(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_website_analyses_updated_at BEFORE UPDATE ON website_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_content_updated_at BEFORE UPDATE ON generated_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hosting_providers_updated_at BEFORE UPDATE ON hosting_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comparisons_updated_at BEFORE UPDATE ON comparisons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE website_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosting_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Website analyses are publicly readable
CREATE POLICY "Website analyses are publicly readable" ON website_analyses FOR SELECT USING (true);
CREATE POLICY "Website analyses are publicly insertable" ON website_analyses FOR INSERT WITH CHECK (true);

-- Generated content policies
CREATE POLICY "Users can view all generated content" ON generated_content FOR SELECT USING (true);
CREATE POLICY "Users can insert generated content" ON generated_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own generated content" ON generated_content FOR UPDATE USING (auth.uid()::text = user_id);

-- Hosting providers are publicly readable
CREATE POLICY "Hosting providers are publicly readable" ON hosting_providers FOR SELECT USING (true);

-- User policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Saved analyses policies
CREATE POLICY "Users can manage their saved analyses" ON saved_analyses FOR ALL USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can manage their favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Comparisons policies
CREATE POLICY "Users can manage their comparisons" ON comparisons FOR ALL USING (auth.uid() = user_id);

-- Insert sample hosting providers
INSERT INTO hosting_providers (name, sustainability_score, green_energy, carbon_neutral, renewable_energy_percentage, data_center_efficiency, certifications, description, website_url, features) VALUES
('Vercel', 85, true, true, 100, 1.2, ARRAY['Carbon Neutral', 'Renewable Energy'], 'Edge-first platform with global CDN and automatic optimization', 'https://vercel.com', ARRAY['Edge Functions', 'Automatic Scaling', 'Global CDN']),
('Netlify', 80, true, true, 95, 1.3, ARRAY['Carbon Neutral'], 'Modern web platform for building fast, secure websites', 'https://netlify.com', ARRAY['Serverless Functions', 'Form Handling', 'Split Testing']),
('GreenGeeks', 95, true, true, 300, 1.1, ARRAY['EPA Green Power Partner', 'Renewable Energy'], 'Eco-friendly web hosting with 300% renewable energy', 'https://greengeeks.com', ARRAY['SSD Storage', 'Free CDN', 'Daily Backups']),
('A2 Hosting', 75, true, false, 80, 1.4, ARRAY['Carbonfund.org Partner'], 'High-performance hosting with carbon offset programs', 'https://a2hosting.com', ARRAY['Turbo Servers', 'Free SSL', 'Developer Tools']),
('DigitalOcean', 70, true, false, 75, 1.5, ARRAY['Renewable Energy Initiative'], 'Cloud infrastructure for developers', 'https://digitalocean.com', ARRAY['Droplets', 'Kubernetes', 'Managed Databases']),
('AWS', 65, true, false, 65, 1.6, ARRAY['Climate Pledge'], 'Comprehensive cloud computing platform', 'https://aws.amazon.com', ARRAY['EC2', 'S3', 'Lambda']),
('Google Cloud', 90, true, true, 100, 1.1, ARRAY['Carbon Neutral', '24/7 Renewable Energy'], 'Google Cloud Platform with carbon-neutral operations', 'https://cloud.google.com', ARRAY['Compute Engine', 'Cloud Storage', 'BigQuery']),
('Microsoft Azure', 75, true, true, 85, 1.3, ARRAY['Carbon Negative by 2030'], 'Microsoft cloud computing platform', 'https://azure.microsoft.com', ARRAY['Virtual Machines', 'App Service', 'Cosmos DB'])
ON CONFLICT (name) DO UPDATE SET
    sustainability_score = EXCLUDED.sustainability_score,
    green_energy = EXCLUDED.green_energy,
    carbon_neutral = EXCLUDED.carbon_neutral,
    renewable_energy_percentage = EXCLUDED.renewable_energy_percentage,
    data_center_efficiency = EXCLUDED.data_center_efficiency,
    certifications = EXCLUDED.certifications,
    description = EXCLUDED.description,
    website_url = EXCLUDED.website_url,
    features = EXCLUDED.features,
    updated_at = NOW();

-- Create a function to get hosting provider recommendations
CREATE OR REPLACE FUNCTION get_hosting_recommendations(target_sustainability_score INTEGER DEFAULT 80)
RETURNS TABLE (
    provider_name TEXT,
    sustainability_score INTEGER,
    green_energy BOOLEAN,
    carbon_neutral BOOLEAN,
    description TEXT,
    website_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hp.name,
        hp.sustainability_score,
        hp.green_energy,
        hp.carbon_neutral,
        hp.description,
        hp.website_url
    FROM hosting_providers hp
    WHERE hp.sustainability_score >= target_sustainability_score
    ORDER BY hp.sustainability_score DESC, hp.renewable_energy_percentage DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Create a function to save website analysis
CREATE OR REPLACE FUNCTION save_website_analysis(
    p_url TEXT,
    p_title TEXT,
    p_summary TEXT,
    p_performance_score INTEGER,
    p_sustainability_score INTEGER,
    p_security_score INTEGER DEFAULT 0,
    p_content_quality_score INTEGER DEFAULT 0,
    p_script_optimization_score INTEGER DEFAULT 0,
    p_key_points TEXT[] DEFAULT ARRAY[]::TEXT[],
    p_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    p_improvements TEXT[] DEFAULT ARRAY[]::TEXT[],
    p_hosting_provider_name TEXT DEFAULT NULL,
    p_ssl_certificate BOOLEAN DEFAULT false,
    p_server_location TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_subdomains TEXT[] DEFAULT ARRAY[]::TEXT[],
    p_content_stats JSONB DEFAULT '{}'::JSONB,
    p_raw_data JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
    analysis_id UUID;
BEGIN
    INSERT INTO website_analyses (
        url, title, summary, performance_score, sustainability_score,
        security_score, content_quality_score, script_optimization_score,
        key_points, keywords, improvements, hosting_provider_name,
        ssl_certificate, server_location, ip_address, subdomains,
        content_stats, raw_data
    ) VALUES (
        p_url, p_title, p_summary, p_performance_score, p_sustainability_score,
        p_security_score, p_content_quality_score, p_script_optimization_score,
        p_key_points, p_keywords, p_improvements, p_hosting_provider_name,
        p_ssl_certificate, p_server_location, p_ip_address, p_subdomains,
        p_content_stats, p_raw_data
    ) RETURNING id INTO analysis_id;
    
    RETURN analysis_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to save generated content
CREATE OR REPLACE FUNCTION save_generated_content(
    p_analysis_id UUID,
    p_content_type TEXT,
    p_title TEXT,
    p_content TEXT,
    p_markdown TEXT DEFAULT NULL,
    p_summary TEXT DEFAULT NULL,
    p_key_points TEXT[] DEFAULT ARRAY[]::TEXT[],
    p_tone TEXT DEFAULT 'professional',
    p_word_count INTEGER DEFAULT 0,
    p_reading_time INTEGER DEFAULT 0,
    p_sections JSONB DEFAULT '[]'::JSONB,
    p_website_url TEXT DEFAULT NULL,
    p_user_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    content_id UUID;
BEGIN
    INSERT INTO generated_content (
        analysis_id, content_type, title, content, markdown,
        summary, key_points, tone, word_count, reading_time,
        sections, website_url, user_id
    ) VALUES (
        p_analysis_id, p_content_type, p_title, p_content, p_markdown,
        p_summary, p_key_points, p_tone, p_word_count, p_reading_time,
        p_sections, p_website_url, p_user_id
    ) RETURNING id INTO content_id;
    
    RETURN content_id;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Supabase Purple Book database setup completed successfully!' as status;

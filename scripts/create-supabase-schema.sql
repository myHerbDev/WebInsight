-- Create the main schema
CREATE SCHEMA IF NOT EXISTS website_analyzer;

-- Website analyses table
CREATE TABLE IF NOT EXISTS website_analyzer.website_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS website_analyzer.generated_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_id UUID REFERENCES website_analyzer.website_analyses(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL,
    tone TEXT DEFAULT 'professional',
    title TEXT,
    content TEXT NOT NULL,
    markdown TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exports table
CREATE TABLE IF NOT EXISTS website_analyzer.exports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_id UUID REFERENCES website_analyzer.website_analyses(id) ON DELETE CASCADE,
    export_format TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hosting providers table
CREATE TABLE IF NOT EXISTS website_analyzer.hosting_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS website_analyzer.comparisons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    analysis_ids JSONB NOT NULL,
    comparison_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tables (for Supabase Auth integration)
CREATE TABLE IF NOT EXISTS website_analyzer.saved_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    analysis_id UUID REFERENCES website_analyzer.website_analyses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, analysis_id)
);

CREATE TABLE IF NOT EXISTS website_analyzer.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    analysis_id UUID REFERENCES website_analyzer.website_analyses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, analysis_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_analyses_url ON website_analyzer.website_analyses(url);
CREATE INDEX IF NOT EXISTS idx_website_analyses_created_at ON website_analyzer.website_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_content_analysis_id ON website_analyzer.generated_content(analysis_id);
CREATE INDEX IF NOT EXISTS idx_saved_analyses_user_id ON website_analyzer.saved_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON website_analyzer.favorites(user_id);

-- Insert some sample hosting providers
INSERT INTO website_analyzer.hosting_providers (name, website, sustainability_score, performance_rating, green_energy, carbon_neutral, renewable_energy_percentage, data_center_locations, certifications, pricing_model, features) VALUES
('Vercel', 'https://vercel.com', 95, 98, true, true, 100, '["Global Edge Network", "US", "EU", "Asia"]', '["Carbon Neutral", "Green Web Foundation"]', 'Pay-as-you-go', '["Edge Functions", "Automatic HTTPS", "Global CDN", "Zero Config"]'),
('Netlify', 'https://netlify.com', 90, 95, true, true, 85, '["US", "EU", "Asia-Pacific"]', '["Carbon Neutral", "B Corp Certified"]', 'Freemium', '["Continuous Deployment", "Form Handling", "Split Testing", "Edge Functions"]'),
('Cloudflare Pages', 'https://pages.cloudflare.com', 92, 97, true, true, 90, '["Global Network", "200+ Cities"]', '["RE100", "Carbon Neutral"]', 'Pay-as-you-go', '["Global CDN", "DDoS Protection", "Workers", "Analytics"]'),
('GitHub Pages', 'https://pages.github.com', 85, 88, true, false, 75, '["US", "EU"]', '["Carbon Neutral by 2030"]', 'Free', '["Jekyll Support", "Custom Domains", "HTTPS", "Version Control"]'),
('AWS Amplify', 'https://aws.amazon.com/amplify', 80, 92, true, true, 65, '["Global", "25+ Regions"]', '["Carbon Neutral by 2040"]', 'Pay-as-you-go', '["Full-Stack Deployment", "CI/CD", "Monitoring", "Authentication"]')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE website_analyzer.saved_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_analyzer.favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own saved analyses" ON website_analyzer.saved_analyses
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own saved analyses" ON website_analyzer.saved_analyses
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own saved analyses" ON website_analyzer.saved_analyses
    FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own favorites" ON website_analyzer.favorites
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own favorites" ON website_analyzer.favorites
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own favorites" ON website_analyzer.favorites
    FOR DELETE USING (auth.uid()::text = user_id);

-- Add new columns to the hosting_providers table if they don't exist
-- Note: PostgreSQL syntax for adding columns if not exists is a bit verbose.
-- For simplicity, this script assumes you might run it on a fresh table or handle "column already exists" errors.
-- Or, you can drop and recreate the table if starting fresh with the new structure.

-- Drop table if it exists to recreate with new schema (for simplicity in this example)
DROP TABLE IF EXISTS hosting_providers;

-- Recreate table with new fields
CREATE TABLE hosting_providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    description TEXT, -- New
    sustainability_score INTEGER,
    renewable_energy_percentage INTEGER,
    carbon_neutral BOOLEAN,
    green_certifications TEXT[],
    data_center_locations TEXT[],
    pricing_tier VARCHAR(50),
    performance_rating INTEGER,
    security_features TEXT[],
    uptime_guarantee NUMERIC(5,2),
    support_quality INTEGER,
    rank INTEGER, -- New
    average_rating NUMERIC(2,1), -- New (e.g., 4.5)
    reviews_count INTEGER, -- New
    cdn_available BOOLEAN, -- New
    ssl_support VARCHAR(50), -- New ('free', 'paid', 'included', 'none')
    infrastructure_type VARCHAR(50) -- New ('cloud', 'dedicated', 'vps', 'shared', 'hybrid')
);

-- Populate with comprehensive data (including new fields)
INSERT INTO hosting_providers (
    name, website, description, sustainability_score, renewable_energy_percentage, carbon_neutral, green_certifications, data_center_locations, pricing_tier, performance_rating, security_features, uptime_guarantee, support_quality, rank, average_rating, reviews_count, cdn_available, ssl_support, infrastructure_type
) VALUES
-- Green Providers
('GreenGeeks', 'https://www.greengeeks.com', 'Eco-friendly hosting with 300% renewable energy match. Strong performance and support.', 95, 300, TRUE, '{"Green Power Partner"}', '{"USA", "Canada", "Netherlands"}', 'Mid-range', 88, '{"Free SSL", "Real-time Scanning", "Proactive Monitoring"}', 99.90, 90, 1, 4.7, 1250, TRUE, 'included', 'shared'),
('A2 Hosting', 'https://www.a2hosting.com', 'Known for speed and green initiatives. Offers carbon offsetting and various hosting types.', 90, 100, TRUE, '{"Carbonfund.org Partner"}', '{"USA", "Netherlands", "Singapore"}', 'Mid-range', 92, '{"Free SSL", "Imunify360", "KernelCare"}', 99.90, 85, 2, 4.6, 2100, TRUE, 'included', 'shared'),
('SiteGround', 'https://www.siteground.com', 'Google Cloud powered, focusing on speed, security, and renewable energy matching.', 88, 100, TRUE, '{"Google Cloud Partner"}', '{"USA", "UK", "Netherlands", "Singapore", "Australia"}', 'Premium', 94, '{"Free SSL", "Custom WAF", "AI Anti-Bot"}', 99.99, 92, 3, 4.8, 3500, TRUE, 'included', 'cloud'),
('Kualo', 'https://www.kualo.com', '100% renewable energy powered hosting based in the UK and USA.', 92, 100, TRUE, '{"The Green Web Foundation"}', '{"UK", "USA"}', 'Mid-range', 85, '{"Free SSL", "DDoS Protection", "Malware Scanning"}', 99.90, 88, 4, 4.5, 600, TRUE, 'included', 'shared'),
('DreamHost', 'https://www.dreamhost.com', 'Employee-owned, committed to sustainability through various initiatives.', 85, 100, TRUE, '{"EPA Green Power Partner"}', '{"USA"}', 'Mid-range', 86, '{"Free SSL", "ModSecurity WAF", "Multi-Factor Auth"}', 99.95, 82, 5, 4.3, 1800, TRUE, 'included', 'shared'),
('Hostinger', 'https://www.hostinger.com', 'Affordable hosting with increasing focus on energy efficiency and renewable sources.', 78, 50, FALSE, '{}', '{"USA", "UK", "Netherlands", "Lithuania", "Singapore", "Brazil", "India"}', 'Budget', 80, '{"Free SSL", "BitNinja Security", "DDoS Protection"}', 99.90, 75, 6, 4.2, 15000, TRUE, 'included', 'shared'),
('InMotion Hosting', 'https://www.inmotionhosting.com', 'USA-based, first green data center, focuses on eco-friendly practices.', 86, 100, TRUE, '{"Green Data Centers"}', '{"USA"}', 'Mid-range', 87, '{"Free SSL", "DDoS Protection", "Automatic Backups"}', 99.90, 84, 7, 4.4, 900, TRUE, 'included', 'vps'),
-- Less Green (or data less available/prominent) - illustrative values for new fields
('GoDaddy', 'https://www.godaddy.com', 'Large provider with a wide range of services. Sustainability efforts are emerging.', 60, 20, FALSE, '{}', '{"Global"}', 'Mid-range', 75, '{"SSL Options", "Website Security Tools"}', 99.90, 70, 8, 3.9, 25000, TRUE, 'paid', 'shared'),
('Bluehost', 'https://www.bluehost.com', 'Popular WordPress hosting, part of EIG. Green initiatives are less prominent.', 55, 15, FALSE, '{}', '{"USA"}', 'Mid-range', 78, '{"Free SSL", "SiteLock (optional)"}', 99.90, 72, 9, 3.8, 18000, TRUE, 'included', 'shared'),
('HostGator', 'https://www.hostgator.com', 'Wide range of hosting, also part of EIG. Some renewable energy credits purchased.', 62, 30, FALSE, '{"Renewable Energy Credits"}', '{"USA"}', 'Budget', 76, '{"Free SSL", "CodeGuard (optional)"}', 99.90, 68, 10, 3.7, 12000, TRUE, 'included', 'shared'),
('IONOS (1&1)', 'https://www.ionos.com', 'European provider with global reach. Focus on energy-efficient data centers.', 70, 40, FALSE, '{"ISO 50001 Certified DCs"}', '{"Europe", "USA"}', 'Mid-range', 82, '{"Free SSL", "DDoS Protection", "SiteLock"}', 99.90, 78, 11, 4.0, 9000, TRUE, 'included', 'cloud'),
('Namecheap', 'https://www.namecheap.com', 'Focus on domains and affordable hosting. Some eco-friendly statements.', 65, 25, FALSE, '{}', '{"USA", "UK", "Netherlands"}', 'Budget', 77, '{"Free SSL (for 1st year)"}', 99.90, 73, 12, 4.1, 10000, TRUE, 'paid', 'shared'),
('WP Engine', 'https://www.wpengine.com', 'Managed WordPress hosting, partners with Google Cloud for infrastructure.', 80, 100, TRUE, '{"Google Cloud Partner"}', '{"Global via GCP"}', 'Premium', 95, '{"Free SSL", "Proprietary WAF", "Threat Detection"}', 99.99, 93, 13, 4.7, 1500, TRUE, 'included', 'cloud'),
('Kinsta', 'https://www.kinsta.com', 'Premium managed WordPress hosting on Google Cloud Platform.', 82, 100, TRUE, '{"Google Cloud Partner"}', '{"Global via GCP"}', 'Premium', 96, '{"Free SSL", "Cloudflare Integration", "DDoS Protection"}', 99.90, 94, 14, 4.8, 1200, TRUE, 'included', 'cloud'),
('Cloudways', 'https://www.cloudways.com', 'Managed cloud hosting platform, choose from various IaaS providers.', 75, 0, FALSE, '{}', '{"Global via IaaS"}', 'Mid-range', 90, '{"Free SSL", "Dedicated Firewalls", "Bot Protection"}', 99.90, 88, 15, 4.6, 1800, TRUE, 'included', 'cloud'),
('Liquid Web', 'https://www.liquidweb.com', 'Managed hosting for mission-critical sites, focus on performance and support.', 68, 10, FALSE, '{}', '{"USA", "Netherlands"}', 'Premium', 93, '{"SSL Available", "ServerSecure", "DDoS Protection"}', 100.00, 95, 16, 4.5, 700, TRUE, 'paid', 'dedicated'),
('Media Temple', 'https://www.mediatemple.net', 'Hosting for creatives and businesses, now part of GoDaddy.', 63, 15, FALSE, '{}', '{"USA"}', 'Premium', 85, '{"SSL Options", "Security Packs"}', 99.90, 80, 17, 4.0, 500, TRUE, 'paid', 'vps'),
('OVHcloud', 'https://www.ovhcloud.com', 'Global cloud provider with a focus on custom-built, water-cooled servers.', 72, 30, FALSE, '{"Water Cooling Tech"}', '{"Global"}', 'Mid-range', 88, '{"Free SSL", "Anti-DDoS", "vRack"}', 99.90, 82, 18, 4.2, 3000, TRUE, 'included', 'cloud'),
('AISO.net', 'https://www.aiso.net', 'Solar-powered hosting provider, one of the pioneers in green hosting.', 96, 100, TRUE, '{"Solar Powered"}', '{"USA (California)"}', 'Mid-range', 80, '{"Free SSL", "Firewall"}', 99.90, 85, 19, 4.4, 150, TRUE, 'included', 'dedicated'),
('Krystal Hosting', 'https://krystal.uk', 'UK-based, 100% renewable energy, strong focus on ethics and transparency.', 94, 100, TRUE, '{"The Green Web Foundation", "1% for the Planet"}', '{"UK", "USA", "Netherlands"}', 'Mid-range', 89, '{"Free SSL", "ImunifyAV+", "DDoS Protection"}', 99.99, 91, 20, 4.9, 2200, TRUE, 'included', 'cloud'),
('Eco Web Hosting', 'https://www.ecowebhosting.co.uk', 'UK-based, plants trees for hosting packages, uses renewable energy.', 91, 100, TRUE, '{"Offset Earth Partner"}', '{"UK"}', 'Budget', 83, '{"Free SSL", "Malware Scanning"}', 99.90, 86, 21, 4.6, 800, TRUE, 'included', 'shared'),
('Vultr', 'https://www.vultr.com', 'High-performance cloud compute, less focus on explicit green initiatives.', 60, 5, FALSE, '{}', '{"Global"}', 'Budget', 91, '{"DDoS Mitigation", "Cloud Firewall"}', 99.99, 80, 22, 4.3, 4000, TRUE, 'paid', 'cloud');

-- You might want to add indexes for performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_hosting_sustainability_score ON hosting_providers(sustainability_score);
CREATE INDEX IF NOT EXISTS idx_hosting_name ON hosting_providers(name);
CREATE INDEX IF NOT EXISTS idx_hosting_pricing_tier ON hosting_providers(pricing_tier);

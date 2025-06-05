-- Clear existing data and insert popular hosting providers
TRUNCATE TABLE website_analyzer.hosting_providers;

INSERT INTO website_analyzer.hosting_providers (
  name, website, sustainability_score, renewable_energy_percentage, carbon_neutral,
  green_certifications, data_center_locations, pricing_tier, performance_rating,
  security_features, uptime_guarantee, support_quality
) VALUES
-- Top Popular Hosting Providers
('Hostinger', 'https://www.hostinger.com', 78, 85, true, 
 '["Renewable Energy Certificates", "Carbon Offset Programs"]'::jsonb,
 '["USA", "Europe", "Asia", "Brazil"]'::jsonb, 'budget', 88,
 '["Free SSL", "DDoS Protection", "Daily Backups", "Cloudflare CDN"]'::jsonb, 99.9, 85),

('GoDaddy', 'https://www.godaddy.com', 72, 75, false,
 '["Energy Star Certified", "Green Business Certification"]'::jsonb,
 '["USA", "Europe", "Asia"]'::jsonb, 'mid-range', 82,
 '["Free SSL", "Malware Protection", "Daily Backups", "24/7 Monitoring"]'::jsonb, 99.9, 80),

('Namecheap', 'https://www.namecheap.com', 85, 95, true,
 '["100% Renewable Energy", "Carbon Neutral Hosting", "Green Web Foundation"]'::jsonb,
 '["USA", "UK", "Netherlands"]'::jsonb, 'budget', 90,
 '["Free SSL", "Two-Factor Authentication", "DDoS Protection", "Free Backups"]'::jsonb, 100, 88),

('Amazon AWS', 'https://aws.amazon.com', 92, 100, true,
 '["100% Renewable Energy by 2025", "Carbon Neutral by 2040", "Sustainability Data Initiative"]'::jsonb,
 '["Global", "26+ Regions", "84+ Availability Zones"]'::jsonb, 'enterprise', 98,
 '["Advanced Security", "IAM", "KMS", "GuardDuty", "WAF", "Shield"]'::jsonb, 99.99, 95),

('Wix.com', 'https://www.wix.com', 68, 60, false,
 '["Green Web Foundation Member"]'::jsonb,
 '["USA", "Europe", "Asia"]'::jsonb, 'mid-range', 85,
 '["Free SSL", "DDoS Protection", "Automatic Backups", "Site Monitoring"]'::jsonb, 99.9, 82),

('Bluehost', 'https://www.bluehost.com', 75, 80, true,
 '["Renewable Energy Credits", "Carbon Offset Programs"]'::jsonb,
 '["USA", "Europe"]'::jsonb, 'mid-range', 84,
 '["Free SSL", "SiteLock Security", "CodeGuard Backups", "Hotlink Protection"]'::jsonb, 99.9, 83),

('SiteGround', 'https://www.siteground.com', 88, 100, true,
 '["100% Renewable Energy", "Google Cloud Partnership", "Carbon Neutral"]'::jsonb,
 '["USA", "Europe", "Asia", "Australia"]'::jsonb, 'premium', 95,
 '["Free SSL", "Daily Backups", "Anti-hack System", "Custom WAF Rules"]'::jsonb, 99.99, 92),

('HostGator', 'https://www.hostgator.com', 70, 70, false,
 '["Energy Efficient Data Centers"]'::jsonb,
 '["USA", "Europe"]'::jsonb, 'budget', 80,
 '["Free SSL", "DDoS Protection", "Automatic Backups", "Malware Detection"]'::jsonb, 99.9, 78),

('Cloudflare', 'https://www.cloudflare.com', 95, 100, true,
 '["100% Renewable Energy", "Climate Neutral", "Efficient Global Network"]'::jsonb,
 '["Global", "270+ Cities", "100+ Countries"]'::jsonb, 'premium', 99,
 '["Advanced DDoS Protection", "WAF", "Bot Management", "Zero Trust Security"]'::jsonb, 99.99, 90),

('DigitalOcean', 'https://www.digitalocean.com', 82, 90, true,
 '["Renewable Energy Credits", "Carbon Neutral Cloud"]'::jsonb,
 '["USA", "Europe", "Asia", "Australia"]'::jsonb, 'mid-range', 93,
 '["VPC", "Firewalls", "Load Balancers", "Monitoring", "Backups"]'::jsonb, 99.99, 87),

('Vercel', 'https://vercel.com', 90, 100, true,
 '["Carbon Neutral", "Edge Network Optimization", "Green Web Foundation"]'::jsonb,
 '["Global Edge Network", "50+ Regions"]'::jsonb, 'premium', 97,
 '["DDoS Protection", "SSL/TLS", "Serverless Security", "Preview Deployments"]'::jsonb, 99.99, 94),

('Netlify', 'https://www.netlify.com', 89, 95, true,
 '["Carbon Neutral Hosting", "Renewable Energy Credits"]'::jsonb,
 '["Global CDN", "Edge Locations Worldwide"]'::jsonb, 'premium', 96,
 '["Form Spam Protection", "SSL/TLS", "Role-based Access", "Audit Logs"]'::jsonb, 99.99, 91),

('Google Cloud', 'https://cloud.google.com', 94, 100, true,
 '["Carbon Neutral Since 2007", "100% Renewable Energy", "Net Zero by 2030"]'::jsonb,
 '["Global", "35+ Regions", "106+ Zones"]'::jsonb, 'enterprise', 99,
 '["Identity & Access Management", "Cloud Security Command Center", "VPC", "Cloud Armor"]'::jsonb, 99.99, 96),

('Microsoft Azure', 'https://azure.microsoft.com', 91, 100, true,
 '["Carbon Negative by 2030", "100% Renewable Energy", "Sustainability Calculator"]'::jsonb,
 '["Global", "60+ Regions", "140+ Countries"]'::jsonb, 'enterprise', 98,
 '["Azure Security Center", "Key Vault", "Active Directory", "Sentinel"]'::jsonb, 99.99, 94),

('A2 Hosting', 'https://www.a2hosting.com', 80, 85, true,
 '["Carbon Neutral Hosting", "Green Web Foundation Member"]'::jsonb,
 '["USA", "Europe", "Asia"]'::jsonb, 'mid-range', 89,
 '["Free SSL", "HackScan Protection", "Dual Firewalls", "Brute Force Defense"]'::jsonb, 99.9, 86);

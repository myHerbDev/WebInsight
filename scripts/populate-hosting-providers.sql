-- Populate hosting providers catalog with comprehensive data
INSERT INTO website_analyzer.hosting_providers (
    name, website, sustainability_score, renewable_energy_percentage, carbon_neutral,
    green_certifications, data_center_locations, pricing_tier, performance_rating,
    security_features, uptime_guarantee, support_quality
) VALUES 
-- Top Tier Green Hosting Providers
('GreenGeeks', 'https://www.greengeeks.com', 95, 300, true, 
 '["EPA Green Power Partner", "Renewable Energy Certificates"]',
 '["USA", "Canada", "Netherlands"]', 'mid-range', 90,
 '["Free SSL", "DDoS Protection", "Daily Backups", "Malware Scanning"]', 99.9, 85),

('A2 Hosting', 'https://www.a2hosting.com', 85, 100, true,
 '["Carbon Neutral", "Green Hosting Initiative"]',
 '["USA", "Europe", "Asia"]', 'mid-range', 95,
 '["Free SSL", "HackScan Protection", "Dual Firewall", "Brute Force Defense"]', 99.9, 90),

('SiteGround', 'https://www.siteground.com', 80, 100, true,
 '["Google Cloud Partnership", "Renewable Energy"]',
 '["USA", "Europe", "Asia-Pacific"]', 'mid-range', 92,
 '["Free SSL", "Daily Backups", "Anti-hack System", "WAF"]', 99.99, 95),

-- Major Cloud Providers
('Amazon Web Services', 'https://aws.amazon.com', 75, 65, false,
 '["Climate Pledge", "Renewable Energy Projects"]',
 '["Global - 25+ regions"]', 'enterprise', 98,
 '["IAM", "VPC", "CloudTrail", "GuardDuty", "Shield"]', 99.99, 85),

('Google Cloud Platform', 'https://cloud.google.com', 90, 100, true,
 '["Carbon Neutral since 2007", "24/7 Renewable Energy by 2030"]',
 '["Global - 35+ regions"]', 'enterprise', 97,
 '["Identity & Access Management", "Cloud Security Command Center", "VPC"]', 99.95, 88),

('Microsoft Azure', 'https://azure.microsoft.com', 85, 60, false,
 '["Carbon Negative by 2030", "Sustainability Calculator"]',
 '["Global - 60+ regions"]', 'enterprise', 96,
 '["Azure Security Center", "Key Vault", "Active Directory", "Sentinel"]', 99.95, 87),

-- Popular Shared Hosting
('Bluehost', 'https://www.bluehost.com', 60, 50, false,
 '["Renewable Energy Initiative"]',
 '["USA", "India"]', 'budget', 75,
 '["Free SSL", "SiteLock Security", "CodeGuard Backups"]', 99.9, 80),

('HostGator', 'https://www.hostgator.com', 55, 45, false,
 '["Green Initiative Program"]',
 '["USA", "India"]', 'budget', 78,
 '["Free SSL", "Malware Protection", "Automatic Backups"]', 99.9, 75),

('GoDaddy', 'https://www.godaddy.com', 50, 40, false,
 '["Carbon Offset Programs"]',
 '["USA", "Europe", "Asia"]', 'budget', 70,
 '["SSL Certificates", "Malware Scanning", "DDoS Protection"]', 99.9, 70),

-- Premium Hosting Providers
('WP Engine', 'https://wpengine.com', 85, 100, true,
 '["Carbon Neutral", "Google Cloud Partnership"]',
 '["USA", "Europe", "Asia-Pacific"]', 'premium', 95,
 '["Threat Detection", "Automated Backups", "SSL", "Firewall"]', 99.95, 92),

('Kinsta', 'https://kinsta.com', 90, 100, true,
 '["Google Cloud Platform", "Carbon Neutral Infrastructure"]',
 '["Global - Google Cloud Network"]', 'premium', 96,
 '["DDoS Protection", "Hardware Firewalls", "SSL", "Malware Scanning"]', 99.9, 94),

('Cloudflare', 'https://www.cloudflare.com', 88, 100, true,
 '["100% Renewable Energy", "Climate Week Commitments"]',
 '["Global - 250+ cities"]', 'mid-range', 98,
 '["DDoS Protection", "WAF", "SSL/TLS", "Bot Management"]', 99.99, 85),

-- Specialized Providers
('DigitalOcean', 'https://www.digitalocean.com', 70, 50, false,
 '["Renewable Energy Initiatives"]',
 '["Global - 13 regions"]', 'mid-range', 88,
 '["VPC", "Firewalls", "Load Balancers", "Monitoring"]', 99.99, 82),

('Linode', 'https://www.linode.com', 75, 60, false,
 '["Green Data Centers", "Energy Efficiency"]',
 '["Global - 11 regions"]', 'mid-range', 90,
 '["Cloud Firewalls", "Private Networking", "Backups", "NodeBalancers"]', 99.9, 88),

('Vultr', 'https://www.vultr.com', 65, 45, false,
 '["Energy Efficient Infrastructure"]',
 '["Global - 25+ locations"]', 'budget', 85,
 '["DDoS Protection", "Private Networking", "Snapshots", "Firewalls"]', 99.9, 80);

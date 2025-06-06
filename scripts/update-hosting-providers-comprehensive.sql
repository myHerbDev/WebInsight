-- Clear existing data and insert comprehensive hosting providers
DELETE FROM hosting_providers;

-- Green Hosting Providers
INSERT INTO hosting_providers (name, website, sustainability_score, renewable_energy_percentage, carbon_neutral, green_certifications, data_center_locations, pricing_tier, performance_rating, security_features, uptime_guarantee, support_quality) VALUES
('GreenGeeks', 'https://www.greengeeks.com', 95, 300, true, '["EPA Green Power Partner", "Renewable Energy Certificates", "Carbon Reducing"]', '["USA", "Canada", "Netherlands"]', 'mid-range', 92, '["Free SSL", "DDoS Protection", "Daily Backups", "Malware Scanning"]', 99.9, 90),
('A2 Hosting', 'https://www.a2hosting.com', 88, 100, true, '["Carbon Neutral", "Green Hosting Initiative"]', '["USA", "Europe", "Asia", "Singapore"]', 'mid-range', 95, '["Free SSL", "HackScan Protection", "Dual Firewall", "Brute Force Defense"]', 99.9, 92),
('SiteGround', 'https://www.siteground.com', 85, 100, true, '["Renewable Energy", "Google Cloud Partnership"]', '["USA", "Europe", "Asia-Pacific", "Australia"]', 'premium', 94, '["Free SSL", "Daily Backups", "Anti-hack System", "Custom WAF"]', 99.99, 95),
('Kualo', 'https://www.kualo.com', 90, 100, true, '["Carbon Neutral", "Renewable Energy Certificates"]', '["UK", "USA"]', 'premium', 89, '["Free SSL", "DDoS Protection", "Malware Scanning", "Daily Backups"]', 99.95, 88),
('AISO.net', 'https://www.aiso.net', 98, 100, true, '["Solar Powered", "Carbon Negative", "B-Corp Certified"]', '["California, USA"]', 'premium', 87, '["Free SSL", "DDoS Protection", "Green Data Centers"]', 99.9, 85),
('Krystal', 'https://krystal.uk', 92, 100, true, '["Carbon Negative", "Renewable Energy", "Tree Planting Program"]', '["UK"]', 'mid-range', 91, '["Free SSL", "DDoS Protection", "Daily Backups", "Malware Protection"]', 99.99, 89),
('Eco Web Hosting', 'https://www.ecowebhosting.co.uk', 94, 100, true, '["Carbon Neutral", "Renewable Energy Certificates", "Eco-Friendly"]', '["UK"]', 'budget', 86, '["Free SSL", "Daily Backups", "Spam Protection"]', 99.9, 82),
('DreamHost', 'https://www.dreamhost.com', 82, 100, true, '["Carbon Neutral", "Renewable Energy Initiative"]', '["USA"]', 'mid-range', 88, '["Free SSL", "DDoS Protection", "Daily Backups", "Malware Removal"]', 99.96, 87),
('Hostinger', 'https://www.hostinger.com', 78, 80, true, '["Carbon Neutral Commitment", "Green Energy Initiative"]', '["Lithuania", "USA", "UK", "Brazil", "Singapore", "India"]', 'budget', 90, '["Free SSL", "DDoS Protection", "Daily Backups", "Malware Scanner"]', 99.9, 85),
('InMotion Hosting', 'https://www.inmotionhosting.com', 80, 85, true, '["Carbon Offset Program", "Green Business Certification"]', '["USA"]', 'mid-range', 91, '["Free SSL", "DDoS Protection", "Malware Protection", "Daily Backups"]', 99.99, 90);

-- Less Green Hosting Providers
INSERT INTO hosting_providers (name, website, sustainability_score, renewable_energy_percentage, carbon_neutral, green_certifications, data_center_locations, pricing_tier, performance_rating, security_features, uptime_guarantee, support_quality) VALUES
('GoDaddy', 'https://www.godaddy.com', 45, 30, false, '[]', '["USA", "Europe", "Asia"]', 'budget', 78, '["Basic SSL", "DDoS Protection", "Malware Scanning"]', 99.9, 75),
('Bluehost', 'https://www.bluehost.com', 52, 40, false, '[]', '["USA"]', 'budget', 82, '["Free SSL", "SiteLock Security", "CodeGuard Backup"]', 99.9, 80),
('HostGator', 'https://www.hostgator.com', 48, 35, false, '[]', '["USA"]', 'budget', 80, '["Free SSL", "DDoS Protection", "Malware Detection"]', 99.9, 78),
('1&1 IONOS', 'https://www.ionos.com', 55, 45, false, '[]', '["USA", "Europe"]', 'mid-range', 85, '["Free SSL", "DDoS Protection", "Daily Backups"]', 99.9, 82),
('Namecheap', 'https://www.namecheap.com', 50, 25, false, '[]', '["USA", "UK"]', 'budget', 83, '["Free SSL", "DDoS Protection", "Website Backup"]', 99.9, 79),
('OVHcloud', 'https://www.ovhcloud.com', 58, 50, false, '[]', '["France", "Canada", "USA", "Germany", "UK", "Poland", "Australia", "Singapore"]', 'mid-range', 87, '["Anti-DDoS", "SSL Certificates", "Backup Solutions"]', 99.95, 84),
('Liquid Web', 'https://www.liquidweb.com', 60, 55, false, '[]', '["USA", "Europe"]', 'enterprise', 93, '["ServerSecure", "DDoS Protection", "Malware Scanning", "SSL Certificates"]', 99.999, 92),
('Media Temple', 'https://mediatemple.net', 62, 60, false, '[]', '["USA"]', 'premium', 89, '["Free SSL", "DDoS Protection", "Daily Backups"]', 99.9, 86),
('WP Engine', 'https://wpengine.com', 65, 65, false, '[]', '["USA", "Europe", "Asia-Pacific"]', 'premium', 94, '["EverCache", "Global CDN", "SSL Certificates", "Malware Detection"]', 99.99, 93),
('Kinsta', 'https://kinsta.com', 68, 70, false, '[]', '["Google Cloud Platform - Global"]', 'premium', 96, '["DDoS Protection", "SSL Certificates", "Malware Detection", "Two-factor Authentication"]', 99.9, 94),
('Cloudways', 'https://www.cloudways.com', 55, 45, false, '[]', '["Multiple Cloud Providers - Global"]', 'mid-range', 91, '["Free SSL", "Dedicated Firewalls", "Regular Security Patching"]', 99.99, 88),
('Vultr', 'https://www.vultr.com', 52, 40, false, '[]', '["Global - 25+ Locations"]', 'budget', 89, '["DDoS Protection", "Private Networking", "Block Storage"]', 99.99, 83);

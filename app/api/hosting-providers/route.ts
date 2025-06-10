import { NextResponse } from "next/server"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { redis, safeRedisOperation, CACHE_KEYS, CACHE_TTL } from "@/lib/upstash-redis"

// Expanded and more diverse fallback hosting providers data
const fallbackHostingProviders = [
  {
    id: "1",
    name: "Vercel GreenServe",
    website: "https://vercel.com",
    sustainability_score: 96,
    performance_rating: 98,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["Green Web Foundation", "RE100", "ISO 14001"],
    data_center_locations: ["Global Edge Network (20+ regions)", "Powered by Renewable Energy"],
    pricing_tier: "premium", // Changed from pricing_model
    features: ["Edge Functions", "Automatic HTTPS", "Global CDN", "Zero Config", "AI-Optimized Infrastructure"],
    average_rating: 4.9,
    review_count: 1250,
    support_quality: 95, // Added
    uptime_guarantee: 99.99, // Added
    security_features: ["DDoS Protection", "WAF", "Automated Backups", "2FA"], // Added
    created_at: new Date("2023-01-15T10:00:00Z").toISOString(),
  },
  {
    id: "2",
    name: "Netlify EcoCloud",
    website: "https://netlify.com",
    sustainability_score: 93,
    performance_rating: 95,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["B Corp Certified", "CarbonNeutral® Company"],
    data_center_locations: ["Global CDN", "Multiple US & EU locations"],
    pricing_tier: "mid-range",
    features: ["Continuous Deployment", "Form Handling", "Split Testing", "Edge Functions", "Serverless Functions"],
    average_rating: 4.7,
    review_count: 980,
    support_quality: 92,
    uptime_guarantee: 99.95,
    security_features: ["Role-Based Access", "Audit Logs", "SSL Encryption"],
    created_at: new Date("2022-11-20T14:30:00Z").toISOString(),
  },
  {
    id: "3",
    name: "Cloudflare Terra",
    website: "https://pages.cloudflare.com",
    sustainability_score: 91,
    performance_rating: 97,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["RE100", "Science Based Targets initiative (SBTi)"],
    data_center_locations: ["Global Edge Network (200+ cities)", "Energy Efficient Data Centers"],
    pricing_tier: "mid-range",
    features: ["Edge Computing", "Workers", "Analytics", "Advanced Security Suite", "Image Optimization"],
    average_rating: 4.8,
    review_count: 1500,
    support_quality: 90,
    uptime_guarantee: 99.98,
    security_features: ["Bot Management", "Rate Limiting", "Argo Smart Routing"],
    created_at: new Date("2023-03-01T09:00:00Z").toISOString(),
  },
  {
    id: "4",
    name: "GreenGeeks Hosting",
    website: "https://www.greengeeks.com/",
    sustainability_score: 98,
    performance_rating: 88,
    renewable_energy_percentage: 300, // 300% offset
    carbon_neutral: true,
    green_certifications: ["Green Power Partner (EPA)", "Tree Planting Initiative"],
    data_center_locations: ["USA", "Canada", "Netherlands"],
    pricing_tier: "budget",
    features: ["Shared Hosting", "WordPress Hosting", "VPS Hosting", "Free SSL", "cPanel"],
    average_rating: 4.5,
    review_count: 750,
    support_quality: 85,
    uptime_guarantee: 99.9,
    security_features: ["Real-time Scanning", "Proactive Monitoring", "Custom Security Rules"],
    created_at: new Date("2022-05-10T12:00:00Z").toISOString(),
  },
  {
    id: "5",
    name: "Kinsta Sustainable Cloud",
    website: "https://kinsta.com/",
    sustainability_score: 89,
    performance_rating: 96,
    renewable_energy_percentage: 100, // Powered by Google Cloud's renewable energy match
    carbon_neutral: true,
    green_certifications: ["Google Cloud Carbon Neutral"],
    data_center_locations: ["Google Cloud Platform (Multiple Regions)"],
    pricing_tier: "premium",
    features: [
      "Managed WordPress Hosting",
      "Google Cloud Infrastructure",
      "Auto-scaling",
      "Daily Backups",
      "Staging Environments",
    ],
    average_rating: 4.9,
    review_count: 1100,
    support_quality: 98,
    uptime_guarantee: 99.9,
    security_features: ["Hardware Firewalls", "DDoS Detection", "Cloudflare Integration"],
    created_at: new Date("2023-02-25T18:00:00Z").toISOString(),
  },
  {
    id: "6",
    name: "EcoWebHosting UK",
    website: "https://www.ecowebhosting.co.uk/",
    sustainability_score: 94,
    performance_rating: 85,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["Trees for Life Partner", "100% UK Renewable Energy"],
    data_center_locations: ["UK Based Data Centers"],
    pricing_tier: "budget",
    features: ["Shared Hosting", "Reseller Hosting", "VPS", "Free Website Builder", "UK Support"],
    average_rating: 4.6,
    review_count: 550,
    support_quality: 90,
    uptime_guarantee: 99.9,
    security_features: ["Imunify360", "SpamExperts", "Daily Backups"],
    created_at: new Date("2022-08-12T11:00:00Z").toISOString(),
  },
]

export async function GET() {
  try {
    const cachedProviders = await safeRedisOperation(
      async () => {
        const cached = await redis!.get(CACHE_KEYS.HOSTING_PROVIDERS)
        return cached ? JSON.parse(cached as string) : null
      },
      null,
      "Error checking hosting providers cache",
    )

    if (cachedProviders) {
      return NextResponse.json({
        success: true,
        data: cachedProviders,
        source: "cache",
      })
    }

    const hostingProviders = await safeDbOperation(
      async () => {
        if (!isNeonAvailable()) throw new Error("Neon not available")
        const result = await sql`
          SELECT 
            id::TEXT, -- Ensure ID is text
            name, 
            website, 
            sustainability_score, 
            performance_rating, 
            renewable_energy_percentage, 
            carbon_neutral, 
            green_certifications, 
            data_center_locations, 
            pricing_tier, 
            features,
            average_rating,
            review_count,
            support_quality,
            uptime_guarantee,
            security_features,
            created_at
          FROM hosting_providers 
          ORDER BY sustainability_score DESC, performance_rating DESC
        `
        return result.length > 0 ? result : fallbackHostingProviders
      },
      fallbackHostingProviders, // Use expanded fallback if DB fails or is empty
      "Error fetching hosting providers from database, using fallback.",
    )

    await safeRedisOperation(
      async () => {
        await redis!.setex(CACHE_KEYS.HOSTING_PROVIDERS, CACHE_TTL.HOSTING_PROVIDERS, JSON.stringify(hostingProviders))
      },
      undefined,
      "Error caching hosting providers",
    )

    return NextResponse.json({
      success: true,
      data: hostingProviders,
      source: isNeonAvailable() && hostingProviders !== fallbackHostingProviders ? "database" : "fallback",
    })
  } catch (error) {
    console.error("Hosting providers API error:", error)
    // Always return fallback on critical error to ensure page loads
    return NextResponse.json({
      success: true, // Still indicate success to render page, but with fallback
      data: fallbackHostingProviders,
      source: "fallback-critical-error",
    })
  }
}

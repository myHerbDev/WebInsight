import { NextResponse } from "next/server"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { redis, safeRedisOperation, CACHE_KEYS, CACHE_TTL } from "@/lib/upstash-redis"

// Fallback hosting providers data
const fallbackHostingProviders = [
  {
    id: "1",
    name: "Vercel",
    website: "https://vercel.com",
    sustainability_score: 95,
    performance_rating: 98,
    green_energy: true,
    carbon_neutral: true,
    renewable_energy_percentage: 100,
    data_center_locations: ["Global Edge Network"],
    certifications: ["Carbon Neutral", "Green Web Foundation"],
    pricing_model: "Pay-as-you-go",
    features: ["Edge Functions", "Automatic HTTPS", "Global CDN", "Zero Config"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Netlify",
    website: "https://netlify.com",
    sustainability_score: 92,
    performance_rating: 95,
    green_energy: true,
    carbon_neutral: true,
    renewable_energy_percentage: 100,
    data_center_locations: ["Global CDN"],
    certifications: ["Carbon Neutral"],
    pricing_model: "Freemium",
    features: ["Continuous Deployment", "Form Handling", "Split Testing", "Edge Functions"],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Cloudflare Pages",
    website: "https://pages.cloudflare.com",
    sustainability_score: 90,
    performance_rating: 97,
    green_energy: true,
    carbon_neutral: true,
    renewable_energy_percentage: 100,
    data_center_locations: ["Global Edge Network"],
    certifications: ["RE100", "Carbon Neutral"],
    pricing_model: "Free/Pro",
    features: ["Edge Computing", "Workers", "Analytics", "Security"],
    created_at: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    // Check cache first
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

    // Try to get data from Neon database if available
    const hostingProviders = await safeDbOperation(
      async () => {
        if (!isNeonAvailable()) throw new Error("Neon not available")

        const result = await sql`
          SELECT * FROM hosting_providers 
          ORDER BY sustainability_score DESC
        `
        return result || []
      },
      fallbackHostingProviders,
      "Error fetching hosting providers from database",
    )

    // Cache the result
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
      source: isNeonAvailable() ? "database" : "fallback",
    })
  } catch (error) {
    console.error("Hosting providers API error:", error)
    return NextResponse.json({
      success: true,
      data: fallbackHostingProviders,
      source: "fallback",
    })
  }
}

import { NextResponse } from "next/server"
import { safeDbOperation, isSupabaseAvailable, getSupabaseClient } from "@/lib/supabase-db"

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
    // Try to get data from Supabase if available
    const hostingProviders = await safeDbOperation(
      async () => {
        const supabase = getSupabaseClient()
        if (!supabase) throw new Error("Supabase not available")

        const { data, error } = await supabase
          .from("hosting_providers")
          .select("*")
          .order("sustainability_score", { ascending: false })

        if (error) throw error
        return data || []
      },
      fallbackHostingProviders,
      "Error fetching hosting providers from database",
    )

    return NextResponse.json({
      success: true,
      data: hostingProviders,
      source: isSupabaseAvailable() ? "database" : "fallback",
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

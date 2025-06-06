import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const providers = await sql`
      SELECT * FROM website_analyzer.hosting_providers 
      ORDER BY sustainability_score DESC
    `

    // Parse JSON fields
    const formattedProviders = providers.map((provider) => ({
      ...provider,
      green_certifications:
        typeof provider.green_certifications === "string"
          ? JSON.parse(provider.green_certifications)
          : provider.green_certifications,
      data_center_locations:
        typeof provider.data_center_locations === "string"
          ? JSON.parse(provider.data_center_locations)
          : provider.data_center_locations,
      security_features:
        typeof provider.security_features === "string"
          ? JSON.parse(provider.security_features)
          : provider.security_features,
    }))

    return NextResponse.json(formattedProviders)
  } catch (error) {
    console.error("Error fetching hosting providers:", error)
    return NextResponse.json({ error: "Failed to fetch hosting providers" }, { status: 500 })
  }
}

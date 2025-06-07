import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const providerId = Number.parseInt(params.id, 10)
    if (isNaN(providerId)) {
      return NextResponse.json({ error: "Invalid provider ID" }, { status: 400 })
    }

    const providerResult = await sql`
      SELECT 
        id,
        name,
        website,
        description,
        sustainability_score,
        renewable_energy_percentage,
        carbon_neutral,
        green_certifications,
        data_center_locations,
        pricing_tier,
        performance_rating,
        security_features,
        uptime_guarantee,
        support_quality,
        created_at,
        updated_at
      FROM website_analyzer.hosting_providers
      WHERE id = ${providerId}
    `

    if (providerResult.length === 0) {
      return NextResponse.json({ error: "Hosting provider not found" }, { status: 404 })
    }

    // Potentially fetch aggregated feedback here later
    // For now, just return the provider details

    return NextResponse.json(providerResult[0])
  } catch (error) {
    console.error("Error fetching hosting provider:", error)
    return NextResponse.json({ error: "Failed to fetch hosting provider" }, { status: 500 })
  }
}

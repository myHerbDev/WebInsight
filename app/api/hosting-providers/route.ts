import { NextResponse } from "next/server"
import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL environment variable is not set.")
  // In a real scenario, you might want to prevent the app from even trying to start
  // or have a more sophisticated config management.
  // For now, we'll let it try and fail, which will be caught by the try/catch below.
}

let sql: NeonQueryFunction<false, false>
try {
  sql = neon(process.env.DATABASE_URL!)
} catch (e) {
  console.error("Failed to initialize Neon SQL client:", e)
  // sql will be undefined, and subsequent calls will fail.
}

export async function GET() {
  console.log("API_HOSTING_PROVIDERS: GET request received.")

  if (!sql) {
    console.error("API_HOSTING_PROVIDERS: SQL client is not initialized. DATABASE_URL might be missing or invalid.")
    return NextResponse.json({ error: "Database connection failed. Server configuration error." }, { status: 500 })
  }

  try {
    console.log("API_HOSTING_PROVIDERS: Attempting to query database...")
    const providersRaw = await sql`
      SELECT 
        id,
        name,
        website,
        description,
        sustainability_score,
        renewable_energy_percentage,
        carbon_neutral,
        green_certifications, -- Keep as string from DB
        data_center_locations, -- Keep as string from DB
        pricing_tier,
        performance_rating,
        security_features, -- Keep as string from DB
        uptime_guarantee,
        support_quality,
        rank,
        average_rating,
        reviews_count,
        cdn_available,
        ssl_support,
        infrastructure_type
      FROM website_analyzer.hosting_providers 
      ORDER BY rank ASC, sustainability_score DESC;
    `
    console.log(`API_HOSTING_PROVIDERS: Query successful. Fetched ${providersRaw.length} raw providers.`)

    if (providersRaw.length === 0) {
      console.warn("API_HOSTING_PROVIDERS: No providers found in the database.")
    }

    const formattedProviders = providersRaw.map((provider) => {
      let parsedGreenCertifications: string[] = []
      try {
        if (typeof provider.green_certifications === "string" && provider.green_certifications.trim() !== "") {
          parsedGreenCertifications = JSON.parse(provider.green_certifications)
        } else if (Array.isArray(provider.green_certifications)) {
          parsedGreenCertifications = provider.green_certifications
        }
      } catch (e) {
        console.warn(
          `API_HOSTING_PROVIDERS: Failed to parse green_certifications for provider ${provider.id} (${provider.name}). Value:`,
          provider.green_certifications,
          "Error:",
          e,
        )
      }

      let parsedDataCenterLocations: string[] = []
      try {
        if (typeof provider.data_center_locations === "string" && provider.data_center_locations.trim() !== "") {
          parsedDataCenterLocations = JSON.parse(provider.data_center_locations)
        } else if (Array.isArray(provider.data_center_locations)) {
          parsedDataCenterLocations = provider.data_center_locations
        }
      } catch (e) {
        console.warn(
          `API_HOSTING_PROVIDERS: Failed to parse data_center_locations for provider ${provider.id} (${provider.name}). Value:`,
          provider.data_center_locations,
          "Error:",
          e,
        )
      }

      let parsedSecurityFeatures: string[] = []
      try {
        if (typeof provider.security_features === "string" && provider.security_features.trim() !== "") {
          parsedSecurityFeatures = JSON.parse(provider.security_features)
        } else if (Array.isArray(provider.security_features)) {
          parsedSecurityFeatures = provider.security_features
        }
      } catch (e) {
        console.warn(
          `API_HOSTING_PROVIDERS: Failed to parse security_features for provider ${provider.id} (${provider.name}). Value:`,
          provider.security_features,
          "Error:",
          e,
        )
      }

      return {
        ...provider,
        // Ensure numeric fields are numbers, handle potential nulls from DB
        sustainability_score: Number(provider.sustainability_score) || 0,
        renewable_energy_percentage: Number(provider.renewable_energy_percentage) || 0,
        performance_rating: Number(provider.performance_rating) || 0,
        uptime_guarantee: Number(provider.uptime_guarantee) || 0,
        support_quality: Number(provider.support_quality) || 0,
        rank: provider.rank === null ? undefined : Number(provider.rank), // Keep undefined if null
        average_rating: provider.average_rating === null ? undefined : Number(provider.average_rating),
        reviews_count: provider.reviews_count === null ? undefined : Number(provider.reviews_count),
        // Parsed JSON fields
        green_certifications: parsedGreenCertifications,
        data_center_locations: parsedDataCenterLocations,
        security_features: parsedSecurityFeatures,
      }
    })
    // console.log("API_HOSTING_PROVIDERS: Formatted providers:", JSON.stringify(formattedProviders.slice(0,2), null, 2)); // Log first 2 for brevity

    return NextResponse.json(formattedProviders)
  } catch (error) {
    console.error("API_HOSTING_PROVIDERS: Error during database query or data processing:", error)
    // Check for specific Neon error types if necessary
    let errorMessage = "Failed to fetch hosting providers due to an internal server error."
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { randomBytes } from "crypto"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const urls = searchParams.get("urls")?.split(",") || []

    if (urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided for comparison" }, { status: 400 })
    }

    // Try to get comparison data from database
    const comparisons = await safeDbOperation(
      async () => {
        if (!isNeonAvailable()) throw new Error("Neon not available")

        const result = await sql`
          SELECT * FROM website_analyses 
          WHERE url = ANY(${urls})
        `
        return result || []
      },
      [],
      "Error fetching comparison data",
    )

    // Generate fallback comparison if no data found
    if (comparisons.length === 0) {
      const fallbackComparisons = urls.map((url, index) => ({
        id: `fallback-${index}`,
        url,
        title: `Website ${index + 1}`,
        summary: `Analysis of ${url}`,
        sustainability_score: 75 + Math.random() * 20,
        performance_score: 70 + Math.random() * 25,
        security_score: 80 + Math.random() * 15,
        content_quality_score: 75 + Math.random() * 20,
        script_optimization_score: 70 + Math.random() * 25,
        key_points: [`Analysis completed for ${url}`, "Performance metrics calculated", "Security assessment done"],
        keywords: ["website", "analysis", "performance"],
        improvements: ["Optimize loading speed", "Improve security headers", "Enhance content quality"],
        created_at: new Date().toISOString(),
      }))

      return NextResponse.json({
        success: true,
        data: fallbackComparisons,
        source: "fallback",
        message: "Using simulated comparison data",
      })
    }

    return NextResponse.json({
      success: true,
      data: comparisons,
      source: isNeonAvailable() ? "database" : "fallback",
    })
  } catch (error) {
    console.error("Comparisons API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch comparison data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    let requestBody
    try {
      const bodyText = await request.text()
      if (!bodyText.trim()) {
        return NextResponse.json({ error: "Empty request body" }, { status: 400 })
      }
      requestBody = JSON.parse(bodyText)
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { websites, comparisonName } = requestBody

    if (!websites || websites.length < 2) {
      return NextResponse.json({ error: "At least 2 websites required for comparison" }, { status: 400 })
    }

    // Save comparison to database if available
    const savedComparison = await safeDbOperation(
      async () => {
        if (!isNeonAvailable()) throw new Error("Neon not available")

        const comparisonId = randomBytes(16).toString("hex")
        await sql`
          INSERT INTO comparisons (id, name, analysis_ids, created_at, updated_at)
          VALUES (
            ${comparisonId}, 
            ${comparisonName || "Website Comparison"}, 
            ${JSON.stringify(websites)}, 
            NOW(), 
            NOW()
          )
        `

        return {
          id: comparisonId,
          name: comparisonName || "Website Comparison",
          websites: websites,
          created_at: new Date().toISOString(),
        }
      },
      {
        id: Date.now().toString(),
        name: comparisonName || "Website Comparison",
        websites: websites,
        created_at: new Date().toISOString(),
      },
      "Error saving comparison",
    )

    return NextResponse.json({
      success: true,
      data: savedComparison,
      source: isNeonAvailable() ? "database" : "local",
    })
  } catch (error) {
    console.error("Save comparison error:", error)
    return NextResponse.json(
      {
        error: "Failed to save comparison",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

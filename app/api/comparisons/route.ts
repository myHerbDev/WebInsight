import { NextResponse } from "next/server"
import { safeDbOperation, isSupabaseAvailable, getSupabaseClient } from "@/lib/supabase-db"

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
        const supabase = getSupabaseClient()
        if (!supabase) throw new Error("Supabase not available")

        const { data, error } = await supabase.from("website_analyses").select("*").in("url", urls)

        if (error) throw error
        return data || []
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
      source: isSupabaseAvailable() ? "database" : "fallback",
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
    const { websites, comparisonName } = await request.json()

    if (!websites || websites.length < 2) {
      return NextResponse.json({ error: "At least 2 websites required for comparison" }, { status: 400 })
    }

    // Save comparison to database if available
    const savedComparison = await safeDbOperation(
      async () => {
        const supabase = getSupabaseClient()
        if (!supabase) throw new Error("Supabase not available")

        const { data, error } = await supabase
          .from("comparisons")
          .insert([
            {
              name: comparisonName || "Website Comparison",
              websites: websites,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (error) throw error
        return data
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
      source: isSupabaseAvailable() ? "database" : "local",
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

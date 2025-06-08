import { NextResponse } from "next/server"
import { analyzeWebsite } from "@/lib/analyzer"
import { sql } from "@vercel/postgres"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    console.log(`Analyzing website: ${url}`)

    const analysisResult = await analyzeWebsite(url)

    if (!analysisResult) {
      return NextResponse.json({ error: "Failed to analyze website" }, { status: 500 })
    }

    // Save analysis to database
    let savedAnalysisId = null
    try {
      const result = await sql`
        INSERT INTO website_analyzer.analyses 
        (url, title, summary, key_points, keywords, sustainability_score, performance_score, 
         content_quality_score, script_optimization_score, improvements, content_stats, 
         ip_address, hosting_provider_name, server_location, analysis_data, created_at)
        VALUES (
          ${url}, 
          ${analysisResult.title}, 
          ${analysisResult.summary}, 
          ${JSON.stringify(analysisResult.key_points || [])},
          ${JSON.stringify(analysisResult.keywords || [])},
          ${analysisResult.sustainability_score || 0},
          ${analysisResult.performance_score || 0},
          ${analysisResult.content_quality_score || 0},
          ${analysisResult.script_optimization_score || 0},
          ${JSON.stringify(analysisResult.improvements || [])},
          ${JSON.stringify(analysisResult.content_stats || {})},
          ${analysisResult.hosting?.ipAddress || null},
          ${analysisResult.hosting?.provider || null},
          ${analysisResult.hosting?.location || null},
          ${JSON.stringify(analysisResult)},
          NOW()
        )
        RETURNING id
      `

      if (result.length > 0) {
        savedAnalysisId = result[0].id
        analysisResult._id = savedAnalysisId
        console.log(`Analysis saved with ID: ${savedAnalysisId}`)
      }
    } catch (dbError) {
      console.error("Error saving analysis to database:", dbError)
      // Continue without database save - analysis still works
    }

    return NextResponse.json({ analysis: analysisResult })
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}

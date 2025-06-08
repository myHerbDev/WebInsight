import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Clean and validate URL
    let cleanUrl = url.trim()
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`
    }

    console.log(`Analyzing website: ${cleanUrl}`)

    // Simulate analysis (replace with actual analysis logic)
    const analysisResult = {
      id: Date.now(),
      url: cleanUrl,
      title: `Analysis of ${cleanUrl}`,
      summary: "Comprehensive website analysis completed successfully.",
      performance_score: Math.floor(Math.random() * 30) + 70,
      seo_score: Math.floor(Math.random() * 30) + 65,
      security_score: Math.floor(Math.random() * 30) + 60,
      accessibility_score: Math.floor(Math.random() * 30) + 70,
      sustainability_score: Math.floor(Math.random() * 30) + 65,
      key_points: [
        "Website loads efficiently with good performance metrics",
        "SEO optimization shows strong foundation",
        "Security measures are adequately implemented",
        "Content structure supports good user experience",
        "Mobile responsiveness is well implemented",
      ],
      keywords: [
        "website",
        "analysis",
        "performance",
        "SEO",
        "security",
        "optimization",
        "user experience",
        "mobile",
        "content",
      ],
      improvements: [
        "Optimize image loading and compression",
        "Enhance meta descriptions and title tags",
        "Implement additional security headers",
        "Improve page loading speed",
        "Add structured data markup",
      ],
      content_stats: {
        word_count: Math.floor(Math.random() * 2000) + 500,
        paragraphs_count: Math.floor(Math.random() * 20) + 5,
        headings_count: Math.floor(Math.random() * 10) + 3,
        images_count: Math.floor(Math.random() * 15) + 2,
        links_count: Math.floor(Math.random() * 50) + 10,
      },
      created_at: new Date().toISOString(),
    }

    // Try to save to database (optional)
    try {
      await sql`
        INSERT INTO website_analyzer.analyses 
        (url, title, summary, performance_score, seo_score, security_score, 
         accessibility_score, sustainability_score, key_points, keywords, 
         improvements, content_stats, created_at)
        VALUES (
          ${analysisResult.url}, ${analysisResult.title}, ${analysisResult.summary},
          ${analysisResult.performance_score}, ${analysisResult.seo_score}, 
          ${analysisResult.security_score}, ${analysisResult.accessibility_score},
          ${analysisResult.sustainability_score}, ${JSON.stringify(analysisResult.key_points)},
          ${JSON.stringify(analysisResult.keywords)}, ${JSON.stringify(analysisResult.improvements)},
          ${JSON.stringify(analysisResult.content_stats)}, ${analysisResult.created_at}
        )
      `
      console.log("Analysis saved to database")
    } catch (dbError) {
      console.error("Database save error:", dbError)
      // Continue without database save
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze website" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { redis, safeRedisOperation, CACHE_KEYS, CACHE_TTL } from "@/lib/upstash-redis"
import { safeJsonParse } from "@/lib/safe-json"
import { safeAsyncOperation, validateRequired } from "@/lib/error-boundary"
import { scrapeWebsiteData } from "@/lib/website-scraper"
import { analyzeSEO } from "@/lib/seo-analyzer"
import { analyzePerformance } from "@/lib/performance-analyzer"
import { analyzeSecurity } from "@/lib/security-analyzer"

export async function POST(request: NextRequest) {
  try {
    console.log("Starting enhanced website analysis request")

    let requestData
    try {
      const body = await request.text()
      if (!body || !body.trim()) {
        return NextResponse.json({ error: "Request body is empty" }, { status: 400 })
      }

      requestData = safeJsonParse(body, null)
      if (!requestData) {
        return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
      }
    } catch (error) {
      console.error("Request parsing error:", error)
      return NextResponse.json({ error: "Failed to parse request body" }, { status: 400 })
    }

    try {
      validateRequired(requestData.url, "url")
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const { url } = requestData
    console.log("Analyzing URL:", url)

    let normalizedUrl: string
    try {
      normalizedUrl = url.trim()
      if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
        normalizedUrl = "https://" + normalizedUrl
      }
      new URL(normalizedUrl)
    } catch (error) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Check cache first
    const cachedAnalysis = await safeRedisOperation(
      async () => {
        const cached = await redis!.get(CACHE_KEYS.ANALYSIS(normalizedUrl))
        return cached ? JSON.parse(cached as string) : null
      },
      null,
      "Error checking cache",
    )

    if (cachedAnalysis) {
      console.log("Returning cached analysis")
      return NextResponse.json(cachedAnalysis)
    }

    // Check if analysis already exists in database
    let existingAnalysis = null
    if (isNeonAvailable()) {
      existingAnalysis = await safeDbOperation(
        async () => {
          const result = await sql`
            SELECT * FROM website_analyses 
            WHERE url = ${normalizedUrl} 
            ORDER BY created_at DESC 
            LIMIT 1
          `
          return result[0] || null
        },
        null,
        "Error checking existing analysis",
      )

      if (existingAnalysis && new Date(existingAnalysis.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        console.log("Returning database analysis")
        const formattedAnalysis = {
          ...existingAnalysis,
          _id: existingAnalysis.id,
          keyPoints: existingAnalysis.key_points || [],
          sustainability: {
            score: existingAnalysis.sustainability_score || 0,
            performance: existingAnalysis.performance_score || 0,
            scriptOptimization: existingAnalysis.script_optimization_score || 0,
            duplicateContent: 0,
            improvements: existingAnalysis.improvements || [],
          },
        }

        await safeRedisOperation(
          async () => {
            await redis!.setex(
              CACHE_KEYS.ANALYSIS(normalizedUrl),
              CACHE_TTL.ANALYSIS,
              JSON.stringify(formattedAnalysis),
            )
          },
          undefined,
          "Error caching analysis",
        )

        return NextResponse.json(formattedAnalysis)
      }
    }

    // Scrape website data using the new engine
    console.log("Scraping website data...")
    const scrapedData = await safeAsyncOperation(
      async () => {
        return await scrapeWebsiteData(normalizedUrl)
      },
      null,
      "Failed to scrape website data",
    )

    if (!scrapedData) {
      return NextResponse.json({ error: "Failed to scrape website data" }, { status: 500 })
    }

    console.log("Website scraped successfully:", scrapedData.title)

    // Perform various analyses
    const seoAnalysis = analyzeSEO(scrapedData)
    const performanceAnalysis = analyzePerformance(scrapedData)
    const securityAnalysis = analyzeSecurity(scrapedData)

    // Generate AI-powered insights if Groq is available
    let aiInsights = null
    if (process.env.GROQ_API_KEY) {
      aiInsights = await safeAsyncOperation(
        async () => {
          const prompt = `Analyze this website data and provide insights:

Website: ${scrapedData.title}
URL: ${normalizedUrl}
Description: ${scrapedData.description}
Content: ${scrapedData.content.textContent.substring(0, 1000)}...

SEO Score: ${seoAnalysis.score}
Performance Score: ${performanceAnalysis.score}
Security Score: ${securityAnalysis.score}

Provide a JSON response with:
- summary: Brief overview of the website
- keyPoints: Array of 3-5 key insights
- improvements: Array of specific improvement suggestions
- sustainability_insights: Environmental impact assessment

Format as valid JSON only.`

          const result = await generateText({
            model: groq("llama-3.1-70b-versatile"),
            prompt,
            maxTokens: 1500,
          })

          return safeJsonParse(result.text, {
            summary: "Analysis completed",
            keyPoints: [],
            improvements: [],
            sustainability_insights: "No specific insights available",
          })
        },
        {
          summary: "Analysis completed using advanced website scraping",
          keyPoints: [
            `Website title: ${scrapedData.title}`,
            `SEO score: ${seoAnalysis.score}/100`,
            `Performance score: ${performanceAnalysis.score}/100`,
            `Security score: ${securityAnalysis.score}/100`,
          ],
          improvements: [
            ...seoAnalysis.recommendations,
            ...performanceAnalysis.recommendations,
            ...securityAnalysis.recommendations,
          ].slice(0, 5),
          sustainability_insights: "Website analysis completed with focus on performance optimization",
        },
        "Failed to generate AI insights",
      )
    }

    // Calculate overall sustainability score
    const sustainabilityScore = Math.round((seoAnalysis.score + performanceAnalysis.score + securityAnalysis.score) / 3)

    // Prepare response data
    const responseData = {
      _id: `analysis_${Date.now()}`,
      url: normalizedUrl,
      title: scrapedData.title,
      summary: aiInsights?.summary || `Comprehensive analysis of ${scrapedData.title}`,
      keyPoints: aiInsights?.keyPoints || [
        `Website successfully analyzed: ${scrapedData.title}`,
        `Found ${scrapedData.content.wordCount} words of content`,
        `SEO optimization score: ${seoAnalysis.score}/100`,
        `Performance score: ${performanceAnalysis.score}/100`,
        `Security assessment: ${securityAnalysis.score}/100`,
      ],
      keywords: scrapedData.keywords,
      sustainability: {
        score: sustainabilityScore,
        performance: performanceAnalysis.score,
        scriptOptimization: Math.max(0, 100 - scrapedData.scripts.length * 5),
        duplicateContent: 85, // Placeholder - would need content analysis
        improvements:
          aiInsights?.improvements ||
          [...seoAnalysis.recommendations, ...performanceAnalysis.recommendations].slice(0, 5),
      },
      subdomains: [], // Would need additional analysis
      contentStats: {
        wordCount: scrapedData.content.wordCount,
        paragraphs: scrapedData.content.paragraphs.length,
        headings: scrapedData.headings.h1.length + scrapedData.headings.h2.length + scrapedData.headings.h3.length,
        images: scrapedData.images.length,
        links: scrapedData.links.internal.length + scrapedData.links.external.length,
        scripts: scrapedData.scripts.length,
        styles: scrapedData.styles.length,
      },
      rawData: {
        paragraphs: scrapedData.content.paragraphs,
        headings: [...scrapedData.headings.h1, ...scrapedData.headings.h2, ...scrapedData.headings.h3],
        links: [...scrapedData.links.internal, ...scrapedData.links.external],
        images: scrapedData.images.map((img) => img.src),
        metaTags: scrapedData.metaTags,
        technicalInfo: scrapedData.technicalInfo,
      },
      // Backward compatibility fields
      sustainability_score: sustainabilityScore,
      performance_score: performanceAnalysis.score,
      script_optimization_score: Math.max(0, 100 - scrapedData.scripts.length * 5),
      content_quality_score: seoAnalysis.score,
      security_score: securityAnalysis.score,
      improvements:
        aiInsights?.improvements ||
        [
          ...seoAnalysis.recommendations,
          ...performanceAnalysis.recommendations,
          ...securityAnalysis.recommendations,
        ].slice(0, 8),
      hosting_provider_name: extractHostingProvider(scrapedData.technicalInfo.serverHeaders),
      ssl_certificate: scrapedData.technicalInfo.hasSSL,
      server_location: "Unknown", // Would need IP geolocation
      ip_address: "Unknown", // Would need DNS lookup
    }

    // Save to Neon database
    if (isNeonAvailable()) {
      await safeDbOperation(
        async () => {
          await sql`
            INSERT INTO website_analyses (
              id, url, title, summary, key_points, keywords,
              sustainability_score, performance_score, script_optimization_score,
              content_quality_score, security_score, improvements,
              hosting_provider_name, ssl_certificate, server_location, ip_address,
              created_at, updated_at
            ) VALUES (
              ${responseData._id}, ${responseData.url}, ${responseData.title}, 
              ${responseData.summary}, ${JSON.stringify(responseData.keyPoints)}, 
              ${JSON.stringify(responseData.keywords)}, ${responseData.sustainability_score},
              ${responseData.performance_score}, ${responseData.script_optimization_score},
              ${responseData.content_quality_score}, ${responseData.security_score},
              ${JSON.stringify(responseData.improvements)}, ${responseData.hosting_provider_name},
              ${responseData.ssl_certificate}, ${responseData.server_location}, ${responseData.ip_address},
              ${new Date().toISOString()}, ${new Date().toISOString()}
            )
          `
          return responseData
        },
        responseData,
        "Error saving analysis to database",
      )
    }

    // Cache the result
    await safeRedisOperation(
      async () => {
        await redis!.setex(CACHE_KEYS.ANALYSIS(normalizedUrl), CACHE_TTL.ANALYSIS, JSON.stringify(responseData))
      },
      undefined,
      "Error caching analysis",
    )

    console.log("Enhanced analysis completed successfully")
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      {
        error: "Internal server error during analysis",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

function extractHostingProvider(headers: Record<string, string>): string {
  const server = headers.server?.toLowerCase() || ""
  const xPoweredBy = headers["x-powered-by"]?.toLowerCase() || ""

  if (server.includes("cloudflare")) return "Cloudflare"
  if (server.includes("nginx")) return "Nginx"
  if (server.includes("apache")) return "Apache"
  if (server.includes("iis")) return "Microsoft IIS"
  if (xPoweredBy.includes("vercel")) return "Vercel"
  if (xPoweredBy.includes("netlify")) return "Netlify"

  return "Unknown"
}

import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { redis, safeRedisOperation, CACHE_KEYS, CACHE_TTL } from "@/lib/upstash-redis"
import { safeJsonParse } from "@/lib/safe-json"
import { safeAsyncOperation, validateRequired } from "@/lib/error-boundary"

export async function POST(request: NextRequest) {
  try {
    console.log("Starting website analysis request")

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

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY not configured")
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    const analysisResult = await safeAsyncOperation(
      async () => {
        const prompt = `Analyze the website: ${normalizedUrl}

Please provide a comprehensive analysis including:
1. Website title and summary
2. Key points about the website
3. Relevant keywords
4. Sustainability metrics (performance, optimization, etc.)
5. Security assessment
6. SEO evaluation

Return the analysis in this exact JSON format:
{
  "title": "Website Title",
  "summary": "Brief summary of the website",
  "keyPoints": ["point1", "point2", "point3"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "sustainability": {
    "score": 85,
    "performance": 90,
    "scriptOptimization": 80,
    "duplicateContent": 75,
    "improvements": ["improvement1", "improvement2"]
  },
  "sustainability_score": 85,
  "performance_score": 90,
  "script_optimization_score": 80,
  "content_quality_score": 85,
  "security_score": 90,
  "improvements": ["improvement1", "improvement2"],
  "hosting_provider_name": "Provider Name",
  "ssl_certificate": true,
  "server_location": "Location",
  "ip_address": "IP Address"
}`

        const result = await generateText({
          model: groq("llama-3.1-70b-versatile"),
          prompt,
          maxTokens: 2000,
        })

        return result.text
      },
      null,
      "Failed to generate AI analysis",
    )

    if (!analysisResult) {
      return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 })
    }

    const analysisData = safeJsonParse(analysisResult, {
      title: "Website Analysis",
      summary: "Analysis completed",
      keyPoints: [],
      keywords: [],
      sustainability: {
        score: 0,
        performance: 0,
        scriptOptimization: 0,
        duplicateContent: 0,
        improvements: [],
      },
      sustainability_score: 0,
      performance_score: 0,
      script_optimization_score: 0,
      content_quality_score: 0,
      security_score: 0,
      improvements: [],
      hosting_provider_name: "Unknown",
      ssl_certificate: false,
      server_location: "Unknown",
      ip_address: "Unknown",
    })

    const responseData = {
      _id: `analysis_${Date.now()}`,
      url: normalizedUrl,
      title: analysisData.title || "Website Analysis",
      summary: analysisData.summary || "Analysis completed",
      keyPoints: Array.isArray(analysisData.keyPoints) ? analysisData.keyPoints : [],
      keywords: Array.isArray(analysisData.keywords) ? analysisData.keywords : [],
      sustainability: analysisData.sustainability || {
        score: 0,
        performance: 0,
        scriptOptimization: 0,
        duplicateContent: 0,
        improvements: [],
      },
      subdomains: [],
      contentStats: {},
      rawData: {},
      sustainability_score: analysisData.sustainability_score || 0,
      performance_score: analysisData.performance_score || 0,
      script_optimization_score: analysisData.script_optimization_score || 0,
      content_quality_score: analysisData.content_quality_score || 0,
      security_score: analysisData.security_score || 0,
      improvements: Array.isArray(analysisData.improvements) ? analysisData.improvements : [],
      hosting_provider_name: analysisData.hosting_provider_name || "Unknown",
      ssl_certificate: analysisData.ssl_certificate || false,
      server_location: analysisData.server_location || "Unknown",
      ip_address: analysisData.ip_address || "Unknown",
    }

    let savedAnalysis = responseData
    if (isNeonAvailable()) {
      savedAnalysis = await safeDbOperation(
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

    console.log("Analysis completed successfully")
    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Internal server error during analysis" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import clientPromise from "@/lib/mongodb"
import { getWebsiteScreenshot } from "@/lib/screenshot"
import { generateWithGroq } from "@/lib/groq"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Normalize URL
    let formattedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      formattedUrl = `https://${url}`
    }

    // Fetch the website content
    console.log(`Fetching website: ${formattedUrl}`)
    const response = await fetch(formattedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract website data
    const title = $("title").text().trim() || formattedUrl.split("//")[1]
    const description = $('meta[name="description"]').attr("content") || ""

    // Extract text content
    const bodyText = $("body").text().replace(/\s+/g, " ").trim()
    const paragraphs = $("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 20)

    // Extract headings
    const headings = $("h1, h2, h3, h4, h5, h6")
      .map((_, el) => $(el).text().trim())
      .get()

    // Extract links
    const links = $("a[href]")
      .map((_, el) => {
        const href = $(el).attr("href") || ""
        if (href.startsWith("http")) return href
        if (href.startsWith("/")) {
          try {
            const baseUrl = new URL(formattedUrl)
            return `${baseUrl.protocol}//${baseUrl.host}${href}`
          } catch (e) {
            return ""
          }
        }
        return ""
      })
      .get()
      .filter(Boolean)

    // Extract images
    const images = $("img[src]")
      .map((_, el) => {
        const src = $(el).attr("src") || ""
        if (src.startsWith("http")) return src
        if (src.startsWith("/")) {
          try {
            const baseUrl = new URL(formattedUrl)
            return `${baseUrl.protocol}//${baseUrl.host}${src}`
          } catch (e) {
            return ""
          }
        }
        return ""
      })
      .get()
      .filter(Boolean)

    // Generate keywords from content
    const words = bodyText
      .toLowerCase()
      .split(/\W+/)
      .filter(
        (word) =>
          word.length > 3 &&
          ![
            "about",
            "after",
            "also",
            "been",
            "before",
            "being",
            "between",
            "both",
            "could",
            "does",
            "doing",
            "during",
            "each",
            "from",
            "have",
            "having",
            "here",
            "more",
            "most",
            "other",
            "some",
            "such",
            "than",
            "that",
            "their",
            "them",
            "then",
            "there",
            "these",
            "they",
            "this",
            "those",
            "what",
            "when",
            "where",
            "which",
            "while",
            "with",
            "would",
            "your",
          ].includes(word),
      )

    const wordFrequency: Record<string, number> = {}
    words.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1
    })

    const keywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word)

    // Extract meta keywords if available
    const metaKeywords = $('meta[name="keywords"]').attr("content") || ""
    if (metaKeywords) {
      const metaKeywordsList = metaKeywords.split(",").map((k) => k.trim().toLowerCase())
      metaKeywordsList.forEach((keyword) => {
        if (keyword && !keywords.includes(keyword) && keywords.length < 20) {
          keywords.push(keyword)
        }
      })
    }

    // Analyze subdomains
    const subdomainSet = new Set<string>()
    links.forEach((link) => {
      try {
        const url = new URL(link)
        const hostname = url.hostname
        if (hostname && !subdomainSet.has(hostname)) {
          subdomainSet.add(hostname)
        }
      } catch (e) {
        // Invalid URL, skip
      }
    })

    const subdomains = Array.from(subdomainSet).slice(0, 10)

    // Calculate performance metrics
    const scriptCount = $("script").length
    const cssCount = $('link[rel="stylesheet"]').length
    const imageCount = images.length
    const totalScriptSize = $("script")
      .map((_, el) => $(el).html()?.length || 0)
      .get()
      .reduce((a, b) => a + b, 0)

    // Calculate sustainability score
    const performanceScore = Math.min(100, Math.max(50, 100 - (scriptCount * 2 + imageCount / 2)))
    const scriptOptimizationScore = Math.min(100, Math.max(50, 100 - (scriptCount * 3 + totalScriptSize / 10000)))

    // Check for duplicate content
    const paragraphTexts = new Set(paragraphs)
    const duplicateContentScore = Math.min(100, Math.max(50, 100 * (paragraphTexts.size / (paragraphs.length || 1))))

    const sustainabilityScore = Math.floor((performanceScore + scriptOptimizationScore + duplicateContentScore) / 3)

    // Generate improvement suggestions
    const improvements: string[] = []

    if (scriptCount > 10) {
      improvements.push("Reduce the number of JavaScript files")
    }
    if (imageCount > 15) {
      improvements.push("Optimize image sizes and implement lazy loading")
    }
    if (cssCount > 5) {
      improvements.push("Consolidate CSS files to reduce HTTP requests")
    }
    if (performanceScore < 80) {
      improvements.push("Implement browser caching for static assets")
    }
    if (scriptOptimizationScore < 75) {
      improvements.push("Minimize and compress JavaScript files")
    }
    if (duplicateContentScore < 80) {
      improvements.push("Remove duplicate content to improve SEO")
    }
    if (!description) {
      improvements.push("Add a meta description to improve SEO")
    }
    if (headings.length < 3) {
      improvements.push("Add more headings to improve content structure")
    }

    // Ensure we have at least 4 improvement suggestions
    const defaultImprovements = [
      "Enable GZIP compression",
      "Use a Content Delivery Network (CDN)",
      "Implement responsive images",
      "Reduce third-party scripts",
    ]

    while (improvements.length < 4) {
      const suggestion = defaultImprovements[improvements.length % defaultImprovements.length]
      if (!improvements.includes(suggestion)) {
        improvements.push(suggestion)
      }
    }

    // Capture screenshot in parallel with other processing
    const screenshotPromise = getWebsiteScreenshot(formattedUrl)

    // Generate enhanced summary with Groq if available
    let summary = description
    let enhancedKeyPoints: string[] = []

    if (process.env.GROQ_API_KEY) {
      try {
        // Create a sample of the website content for the AI
        const contentSample = paragraphs.slice(0, 5).join("\n\n")
        const headingSample = headings.slice(0, 10).join("\n")

        const prompt = `
          Analyze this website content and provide:
          1. A concise summary (max 2 sentences)
          2. 5 key insights about the website's purpose, audience, and content quality
          
          Website title: ${title}
          Description: ${description}
          
          Sample headings:
          ${headingSample}
          
          Sample content:
          ${contentSample}
          
          Keywords: ${keywords.join(", ")}
          
          Format your response as JSON with "summary" and "keyPoints" fields.
        `

        const aiResponse = await generateWithGroq(prompt, 800)

        try {
          const parsedResponse = JSON.parse(aiResponse)
          if (parsedResponse.summary) {
            summary = parsedResponse.summary
          }
          if (parsedResponse.keyPoints && Array.isArray(parsedResponse.keyPoints)) {
            enhancedKeyPoints = parsedResponse.keyPoints
          }
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError)
          // Continue with default summary
        }
      } catch (aiError) {
        console.error("Error generating enhanced summary:", aiError)
        // Continue with default summary
      }
    }

    // Use default summary if AI generation failed
    if (!summary && paragraphs.length > 0) {
      summary = paragraphs[0].substring(0, 200)
      if (paragraphs[0].length > 200) summary += "..."
    }
    if (!summary) {
      summary = `This is a website titled "${title}" with ${links.length} links, ${imageCount} images, and ${paragraphs.length} paragraphs of content.`
    }

    // Use enhanced key points or generate default ones
    const keyPoints =
      enhancedKeyPoints.length > 0
        ? enhancedKeyPoints
        : [
            imageCount > 0 ? `Contains ${imageCount} images` : "No images found",
            `Has ${links.length} links to other pages or websites`,
            `Contains ${headings.length} headings and ${paragraphs.length} paragraphs`,
            scriptCount > 0 ? `Uses ${scriptCount} JavaScript files` : "No JavaScript detected",
            cssCount > 0 ? `Uses ${cssCount} CSS stylesheets` : "No CSS stylesheets detected",
          ]

    // Create content stats
    const contentStats = {
      wordCount: words.length,
      paragraphs: paragraphs.length,
      headings: headings.length,
      images: imageCount,
      links: links.length,
    }

    // Wait for the screenshot to complete
    const screenshotUrl = await screenshotPromise

    // Create the analysis result
    const analysisResult = {
      url: formattedUrl,
      title,
      summary,
      keyPoints,
      keywords,
      sustainability: {
        score: sustainabilityScore,
        performance: performanceScore,
        scriptOptimization: scriptOptimizationScore,
        duplicateContent: duplicateContentScore,
        improvements,
      },
      subdomains,
      contentStats,
      screenshotUrl,
      rawData: {
        paragraphs: paragraphs.slice(0, 20),
        headings: headings.slice(0, 20),
        links: links.slice(0, 50),
      },
      createdAt: new Date(),
    }

    // Save to MongoDB if available
    let analysisId = "analysis-" + Date.now()
    if (process.env.MONGODB_URI) {
      try {
        const client = await clientPromise
        const db = client.db("website-analyzer")
        const result = await db.collection("analyses").insertOne(analysisResult)
        analysisId = result.insertedId.toString()
      } catch (dbError) {
        console.error("MongoDB error (non-critical):", dbError)
      }
    }

    return NextResponse.json({
      ...analysisResult,
      _id: analysisId,
    })
  } catch (error) {
    console.error("Error analyzing website:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze website",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import * as cheerio from "cheerio"

const sql = neon(process.env.DATABASE_URL!)

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

    // Validate URL format
    try {
      new URL(formattedUrl)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    console.log(`Starting analysis of: ${formattedUrl}`)

    // Fetch the website content with proper headers and timeout
    let html = ""
    let response: Response

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      response = await fetch(formattedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        signal: controller.signal,
        redirect: "follow",
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      html = await response.text()
      console.log(`Successfully fetched ${html.length} characters from ${formattedUrl}`)
    } catch (error) {
      console.error(`Failed to fetch ${formattedUrl}:`, error)
      return NextResponse.json(
        {
          error: "Failed to fetch website",
          message: error instanceof Error ? error.message : "Network error",
          details: "Please check if the website is accessible and try again",
        },
        { status: 500 },
      )
    }

    // Parse HTML content
    const $ = cheerio.load(html)

    // Extract basic information
    const title =
      $("title").text().trim() ||
      $("h1").first().text().trim() ||
      formattedUrl.split("//")[1]?.split("/")[0] ||
      "Unknown Website"

    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      ""

    // Extract text content
    $("script, style, nav, footer, aside, .advertisement, .ads").remove()
    const bodyText = $("body").text().replace(/\s+/g, " ").trim()

    const paragraphs = $("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 20)
      .slice(0, 20)

    // Extract headings
    const headings = $("h1, h2, h3, h4, h5, h6")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 0)
      .slice(0, 20)

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
      .slice(0, 50)

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
      .slice(0, 30)

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
            "will",
            "said",
            "make",
            "like",
            "time",
            "just",
            "know",
            "take",
            "people",
            "into",
            "year",
            "good",
            "work",
            "well",
            "many",
            "first",
            "right",
            "life",
            "way",
            "even",
            "back",
            "only",
            "think",
            "come",
            "hand",
            "high",
            "large",
            "world",
            "still",
            "place",
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

    // Analyze subdomains from links
    const subdomainSet = new Set<string>()
    const baseHostname = new URL(formattedUrl).hostname

    links.forEach((link) => {
      try {
        const linkUrl = new URL(link)
        const hostname = linkUrl.hostname
        if (hostname && hostname !== baseHostname && !subdomainSet.has(hostname)) {
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
    const totalElements = $("*").length

    const totalScriptSize = $("script")
      .map((_, el) => $(el).html()?.length || 0)
      .get()
      .reduce((a, b) => a + b, 0)

    // Calculate sustainability scores
    const performanceScore = Math.min(100, Math.max(30, 100 - (scriptCount * 2 + imageCount / 3)))
    const scriptOptimizationScore = Math.min(100, Math.max(30, 100 - (scriptCount * 3 + totalScriptSize / 10000)))

    // Check for duplicate content
    const paragraphTexts = new Set(paragraphs)
    const duplicateContentScore = Math.min(
      100,
      Math.max(40, 100 * (paragraphTexts.size / Math.max(paragraphs.length, 1))),
    )

    const sustainabilityScore = Math.floor((performanceScore + scriptOptimizationScore + duplicateContentScore) / 3)

    // Generate improvement suggestions based on actual analysis
    const improvements: string[] = []

    if (scriptCount > 10) {
      improvements.push("Reduce the number of JavaScript files to improve loading speed")
    }
    if (imageCount > 20) {
      improvements.push("Optimize image sizes and implement lazy loading")
    }
    if (cssCount > 5) {
      improvements.push("Consolidate CSS files to reduce HTTP requests")
    }
    if (performanceScore < 70) {
      improvements.push("Implement browser caching for static assets")
    }
    if (scriptOptimizationScore < 70) {
      improvements.push("Minimize and compress JavaScript files")
    }
    if (duplicateContentScore < 70) {
      improvements.push("Remove duplicate content to improve SEO")
    }
    if (!description) {
      improvements.push("Add a meta description to improve SEO")
    }
    if (headings.length < 3) {
      improvements.push("Add more headings to improve content structure")
    }
    if (totalElements > 1000) {
      improvements.push("Simplify page structure to reduce DOM complexity")
    }

    // Ensure we have at least 4 improvement suggestions
    const defaultImprovements = [
      "Enable GZIP compression to reduce file sizes",
      "Use a Content Delivery Network (CDN) for faster content delivery",
      "Implement responsive images for better mobile performance",
      "Reduce third-party scripts and tracking codes",
      "Optimize font loading to prevent layout shifts",
      "Implement proper caching headers for static resources",
    ]

    while (improvements.length < 4) {
      const suggestion = defaultImprovements[improvements.length % defaultImprovements.length]
      if (!improvements.includes(suggestion)) {
        improvements.push(suggestion)
      }
    }

    // Create summary
    let summary = description
    if (!summary && paragraphs.length > 0) {
      summary = paragraphs[0].substring(0, 200)
      if (paragraphs[0].length > 200) summary += "..."
    }
    if (!summary) {
      summary = `${title} is a website with ${links.length} links, ${imageCount} images, and ${paragraphs.length} content sections. The site focuses on ${keywords.slice(0, 3).join(", ")}.`
    }

    // Generate key points based on actual analysis
    const keyPoints = [
      `Contains ${imageCount} images and ${links.length} external links`,
      `Has ${headings.length} headings organizing ${paragraphs.length} content sections`,
      `Uses ${scriptCount} JavaScript files and ${cssCount} CSS stylesheets`,
      `Focuses on topics related to ${keywords.slice(0, 3).join(", ")}`,
      `${sustainabilityScore > 75 ? "Demonstrates good" : "Shows potential for improved"} performance optimization`,
    ]

    // Create content stats
    const contentStats = {
      wordCount: words.length,
      paragraphs: paragraphs.length,
      headings: headings.length,
      images: imageCount,
      links: links.length,
    }

    // Create the analysis result
    const analysisResult = {
      url: formattedUrl,
      title,
      summary,
      key_points: keyPoints,
      keywords,
      sustainability_score: sustainabilityScore,
      performance_score: performanceScore,
      script_optimization_score: scriptOptimizationScore,
      content_quality_score: duplicateContentScore,
      improvements,
      subdomains,
      content_stats: contentStats,
      raw_data: {
        paragraphs: paragraphs.slice(0, 10),
        headings: headings.slice(0, 15),
        links: links.slice(0, 30),
      },
      created_at: new Date(),
    }

    // Save to Neon database
    let analysisId: number
    try {
      const result = await sql`
        INSERT INTO website_analyzer.analyses 
        (url, title, summary, key_points, keywords, sustainability_score, performance_score, 
         script_optimization_score, content_quality_score, improvements, subdomains, 
         content_stats, raw_data, created_at)
        VALUES (
          ${formattedUrl}, ${title}, ${summary}, ${JSON.stringify(keyPoints)}, 
          ${JSON.stringify(keywords)}, ${sustainabilityScore}, ${performanceScore},
          ${scriptOptimizationScore}, ${duplicateContentScore}, ${JSON.stringify(improvements)},
          ${JSON.stringify(subdomains)}, ${JSON.stringify(contentStats)}, 
          ${JSON.stringify(analysisResult.raw_data)}, NOW()
        )
        RETURNING id
      `
      analysisId = result[0].id
      console.log(`Analysis saved to database with ID: ${analysisId}`)
    } catch (dbError) {
      console.error("Database error (non-critical):", dbError)
      analysisId = Date.now() // Fallback ID
    }

    return NextResponse.json({
      ...analysisResult,
      _id: analysisId.toString(),
      // Legacy format for compatibility
      sustainability: {
        score: sustainabilityScore,
        performance: performanceScore,
        scriptOptimization: scriptOptimizationScore,
        duplicateContent: duplicateContentScore,
        improvements,
      },
      keyPoints,
      contentStats,
    })
  } catch (error) {
    console.error("Error analyzing website:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze website",
        message: error instanceof Error ? error.message : "Unknown error",
        details: "Please check the URL and try again. Some websites may block automated analysis.",
      },
      { status: 500 },
    )
  }
}

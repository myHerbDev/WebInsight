import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import * as cheerio from "cheerio"
import { lookup } from "dns/promises"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { url, userId } = await request.json()

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

    console.log(`Starting enhanced analysis of: ${formattedUrl}`)

    // Get IP address and hosting information
    let ipAddress = null
    let hostingInfo = null
    try {
      const hostname = new URL(formattedUrl).hostname
      const addresses = await lookup(hostname)
      ipAddress = addresses.address

      // Detect hosting provider based on IP ranges and reverse DNS
      hostingInfo = await detectHostingProvider(ipAddress, hostname)
    } catch (error) {
      console.error("Failed to get hosting info:", error)
    }

    // Fetch the website content with enhanced headers
    let html = ""
    let response: Response
    let securityHeaders: Record<string, string> = {}

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

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

      // Extract security headers
      securityHeaders = extractSecurityHeaders(response.headers)

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

    // Enhanced content extraction
    $("script, style, nav, footer, aside, .advertisement, .ads").remove()
    const bodyText = $("body").text().replace(/\s+/g, " ").trim()

    const paragraphs = $("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 20)
      .slice(0, 20)

    const headings = $("h1, h2, h3, h4, h5, h6")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 0)
      .slice(0, 20)

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

    // Enhanced keyword extraction
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

    // Enhanced performance calculations
    const scriptCount = $("script").length
    const cssCount = $('link[rel="stylesheet"]').length
    const imageCount = images.length
    const totalElements = $("*").length

    const totalScriptSize = $("script")
      .map((_, el) => $(el).html()?.length || 0)
      .get()
      .reduce((a, b) => a + b, 0)

    // Calculate enhanced scores
    const performanceScore = Math.min(100, Math.max(30, 100 - (scriptCount * 2 + imageCount / 3)))
    const scriptOptimizationScore = Math.min(100, Math.max(30, 100 - (scriptCount * 3 + totalScriptSize / 10000)))

    // Check for duplicate content
    const paragraphTexts = new Set(paragraphs)
    const duplicateContentScore = Math.min(
      100,
      Math.max(40, 100 * (paragraphTexts.size / Math.max(paragraphs.length, 1))),
    )

    // Calculate security score
    const securityScore = calculateSecurityScore(formattedUrl, securityHeaders, $)

    const sustainabilityScore = Math.floor((performanceScore + scriptOptimizationScore + duplicateContentScore) / 3)

    // Generate improvement suggestions
    const improvements = generateImprovements(
      scriptCount,
      imageCount,
      cssCount,
      performanceScore,
      scriptOptimizationScore,
      duplicateContentScore,
      securityScore,
      description,
      headings.length,
      totalElements,
    )

    // Create summary
    let summary = description
    if (!summary && paragraphs.length > 0) {
      summary = paragraphs[0].substring(0, 200)
      if (paragraphs[0].length > 200) summary += "..."
    }
    if (!summary) {
      summary = `${title} is a website with ${links.length} links, ${imageCount} images, and ${paragraphs.length} content sections. The site focuses on ${keywords.slice(0, 3).join(", ")}.`
    }

    // Generate key points
    const keyPoints = [
      `Contains ${imageCount} images and ${links.length} external links`,
      `Has ${headings.length} headings organizing ${paragraphs.length} content sections`,
      `Uses ${scriptCount} JavaScript files and ${cssCount} CSS stylesheets`,
      `Focuses on topics related to ${keywords.slice(0, 3).join(", ")}`,
      `${sustainabilityScore > 75 ? "Demonstrates good" : "Shows potential for improved"} performance optimization`,
      `Security score of ${securityScore}% with ${Object.keys(securityHeaders).length} security headers`,
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
      security_score: securityScore,
      ssl_certificate: formattedUrl.startsWith("https://"),
      security_headers: securityHeaders,
      improvements,
      subdomains,
      content_stats: contentStats,
      raw_data: {
        paragraphs: paragraphs.slice(0, 10),
        headings: headings.slice(0, 15),
        links: links.slice(0, 30),
      },
      ip_address: ipAddress,
      hosting_provider_name: hostingInfo?.name || null,
      hosting_provider_id: hostingInfo?.id || null,
      server_location: hostingInfo?.location || null,
      user_id: userId || null,
      created_at: new Date(),
    }

    // Save to Neon database
    let analysisId: number
    try {
      const result = await sql`
        INSERT INTO website_analyzer.analyses 
        (url, title, summary, key_points, keywords, sustainability_score, performance_score, 
         script_optimization_score, content_quality_score, security_score, ssl_certificate,
         security_headers, improvements, subdomains, content_stats, raw_data, ip_address,
         hosting_provider_name, hosting_provider_id, server_location, user_id, created_at)
        VALUES (
          ${formattedUrl}, ${title}, ${summary}, ${JSON.stringify(keyPoints)}, 
          ${JSON.stringify(keywords)}, ${sustainabilityScore}, ${performanceScore},
          ${scriptOptimizationScore}, ${duplicateContentScore}, ${securityScore},
          ${formattedUrl.startsWith("https://")}, ${JSON.stringify(securityHeaders)},
          ${JSON.stringify(improvements)}, ${JSON.stringify(subdomains)}, 
          ${JSON.stringify(contentStats)}, ${JSON.stringify(analysisResult.raw_data)},
          ${ipAddress}, ${hostingInfo?.name || null}, ${hostingInfo?.id || null},
          ${hostingInfo?.location || null}, ${userId || null}, NOW()
        )
        RETURNING id
      `
      analysisId = result[0].id
      console.log(`Analysis saved to database with ID: ${analysisId}`)

      // Generate and save recommendations
      await generateAndSaveRecommendations(analysisId, analysisResult)
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
      hostingInfo,
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

// Helper functions
function extractSecurityHeaders(headers: Headers): Record<string, string> {
  const securityHeaders: Record<string, string> = {}

  const securityHeaderNames = [
    "strict-transport-security",
    "content-security-policy",
    "x-frame-options",
    "x-content-type-options",
    "x-xss-protection",
    "referrer-policy",
    "permissions-policy",
    "expect-ct",
  ]

  securityHeaderNames.forEach((headerName) => {
    const value = headers.get(headerName)
    if (value) {
      securityHeaders[headerName] = value
    }
  })

  return securityHeaders
}

function calculateSecurityScore(url: string, securityHeaders: Record<string, string>, $: cheerio.CheerioAPI): number {
  let score = 0

  // HTTPS check (30 points)
  if (url.startsWith("https://")) {
    score += 30
  }

  // Security headers (50 points total)
  const criticalHeaders = [
    "strict-transport-security", // 10 points
    "content-security-policy", // 15 points
    "x-frame-options", // 10 points
    "x-content-type-options", // 5 points
    "x-xss-protection", // 5 points
    "referrer-policy", // 5 points
  ]

  const headerScores = [10, 15, 10, 5, 5, 5]
  criticalHeaders.forEach((header, index) => {
    if (securityHeaders[header]) {
      score += headerScores[index]
    }
  })

  // Additional security checks (20 points)
  // Check for mixed content
  const hasHttpResources = $('img[src^="http:"], script[src^="http:"], link[href^="http:"]').length === 0
  if (hasHttpResources) score += 10

  // Check for inline scripts (security risk)
  const inlineScripts = $("script:not([src])").length
  if (inlineScripts < 3) score += 10

  return Math.min(100, score)
}

async function detectHostingProvider(
  ipAddress: string,
  hostname: string,
): Promise<{ id: number; name: string; location: string } | null> {
  try {
    // Simple hosting provider detection based on common patterns
    const providers = [
      { pattern: /amazonaws\.com|aws/, name: "Amazon Web Services", id: 4 },
      { pattern: /googleusercontent\.com|google/, name: "Google Cloud Platform", id: 5 },
      { pattern: /azure|microsoft/, name: "Microsoft Azure", id: 6 },
      { pattern: /cloudflare/, name: "Cloudflare", id: 12 },
      { pattern: /digitalocean/, name: "DigitalOcean", id: 13 },
      { pattern: /linode/, name: "Linode", id: 14 },
      { pattern: /vultr/, name: "Vultr", id: 15 },
      { pattern: /bluehost/, name: "Bluehost", id: 7 },
      { pattern: /hostgator/, name: "HostGator", id: 8 },
      { pattern: /godaddy/, name: "GoDaddy", id: 9 },
      { pattern: /siteground/, name: "SiteGround", id: 3 },
      { pattern: /wpengine/, name: "WP Engine", id: 10 },
      { pattern: /kinsta/, name: "Kinsta", id: 11 },
    ]

    for (const provider of providers) {
      if (provider.pattern.test(hostname.toLowerCase())) {
        return {
          id: provider.id,
          name: provider.name,
          location: "Unknown", // Would need IP geolocation service for accurate location
        }
      }
    }

    return null
  } catch (error) {
    console.error("Error detecting hosting provider:", error)
    return null
  }
}

function generateImprovements(
  scriptCount: number,
  imageCount: number,
  cssCount: number,
  performanceScore: number,
  scriptOptimizationScore: number,
  duplicateContentScore: number,
  securityScore: number,
  description: string,
  headingCount: number,
  totalElements: number,
): string[] {
  const improvements: string[] = []

  // Performance improvements
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

  // Security improvements
  if (securityScore < 70) {
    improvements.push("Implement security headers (CSP, HSTS, X-Frame-Options)")
  }
  if (securityScore < 50) {
    improvements.push("Enable HTTPS and implement proper SSL/TLS configuration")
  }

  // Content improvements
  if (duplicateContentScore < 70) {
    improvements.push("Remove duplicate content to improve SEO")
  }
  if (!description) {
    improvements.push("Add a meta description to improve SEO")
  }
  if (headingCount < 3) {
    improvements.push("Add more headings to improve content structure")
  }

  // Technical improvements
  if (totalElements > 1000) {
    improvements.push("Simplify page structure to reduce DOM complexity")
  }

  // Sustainability improvements
  improvements.push("Consider green hosting providers to reduce carbon footprint")
  improvements.push("Implement efficient caching strategies to reduce server load")

  // Ensure we have at least 6 improvement suggestions
  const defaultImprovements = [
    "Enable GZIP compression to reduce file sizes",
    "Use a Content Delivery Network (CDN) for faster content delivery",
    "Implement responsive images for better mobile performance",
    "Reduce third-party scripts and tracking codes",
    "Optimize font loading to prevent layout shifts",
    "Implement proper caching headers for static resources",
  ]

  while (improvements.length < 6) {
    const suggestion = defaultImprovements[improvements.length % defaultImprovements.length]
    if (!improvements.includes(suggestion)) {
      improvements.push(suggestion)
    }
  }

  return improvements
}

async function generateAndSaveRecommendations(analysisId: number, analysis: any) {
  const recommendations = [
    {
      category: "performance",
      priority: analysis.performance_score < 60 ? "high" : analysis.performance_score < 80 ? "medium" : "low",
      title: "Optimize Website Performance",
      description: `Your website has a performance score of ${analysis.performance_score}%. Improving performance will enhance user experience and search engine rankings.`,
      implementation_steps: [
        "Minimize HTTP requests by combining CSS and JavaScript files",
        "Optimize images by compressing and using modern formats (WebP, AVIF)",
        "Enable browser caching with proper cache headers",
        "Use a Content Delivery Network (CDN)",
        "Minimize and compress CSS and JavaScript files",
      ],
      estimated_impact: analysis.performance_score < 60 ? "high" : "medium",
      estimated_effort: "moderate",
      resources: ["https://web.dev/performance/", "https://developers.google.com/speed/pagespeed/insights/"],
    },
    {
      category: "security",
      priority: analysis.security_score < 60 ? "high" : analysis.security_score < 80 ? "medium" : "low",
      title: "Enhance Website Security",
      description: `Your website has a security score of ${analysis.security_score}%. Implementing security best practices will protect your site and users.`,
      implementation_steps: [
        "Implement HTTPS with a valid SSL certificate",
        "Add security headers (CSP, HSTS, X-Frame-Options)",
        "Keep software and plugins updated",
        "Use strong authentication methods",
        "Regular security audits and monitoring",
      ],
      estimated_impact: "high",
      estimated_effort: analysis.security_score < 60 ? "moderate" : "easy",
      resources: ["https://owasp.org/www-project-top-ten/", "https://securityheaders.com/"],
    },
    {
      category: "sustainability",
      priority: analysis.sustainability_score < 70 ? "high" : "medium",
      title: "Improve Environmental Impact",
      description: `Your website has a sustainability score of ${analysis.sustainability_score}%. Reducing environmental impact helps the planet and can improve performance.`,
      implementation_steps: [
        "Choose a green hosting provider with renewable energy",
        "Optimize images and reduce file sizes",
        "Implement efficient caching strategies",
        "Minimize third-party scripts and trackers",
        "Use efficient coding practices",
      ],
      estimated_impact: "medium",
      estimated_effort: "moderate",
      resources: ["https://www.websitecarbon.com/", "https://sustainablewebdesign.org/"],
    },
  ]

  try {
    for (const rec of recommendations) {
      await sql`
        INSERT INTO website_analyzer.recommendations 
        (analysis_id, category, priority, title, description, implementation_steps, 
         estimated_impact, estimated_effort, resources, created_at)
        VALUES (
          ${analysisId}, ${rec.category}, ${rec.priority}, ${rec.title}, 
          ${rec.description}, ${JSON.stringify(rec.implementation_steps)},
          ${rec.estimated_impact}, ${rec.estimated_effort}, 
          ${JSON.stringify(rec.resources)}, NOW()
        )
      `
    }
  } catch (error) {
    console.error("Error saving recommendations:", error)
  }
}

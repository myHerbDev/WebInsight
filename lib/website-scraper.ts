export interface ScrapedWebsiteData {
  title: string
  description: string
  keywords: string[]
  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
  }
  metaTags: {
    title?: string
    description?: string
    keywords?: string
    author?: string
    robots?: string
    viewport?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    twitterTitle?: string
    twitterDescription?: string
    twitterImage?: string
  }
  links: {
    internal: string[]
    external: string[]
  }
  images: {
    src: string
    alt: string
    title?: string
  }[]
  scripts: string[]
  styles: string[]
  content: {
    textContent: string
    wordCount: number
    paragraphs: string[]
  }
  technicalInfo: {
    hasSSL: boolean
    responseTime: number
    statusCode: number
    contentType: string
    charset: string
    serverHeaders: Record<string, string>
  }
}

export async function scrapeWebsiteData(url: string): Promise<ScrapedWebsiteData> {
  const startTime = Date.now()

  try {
    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl
    }

    console.log("Scraping website:", normalizedUrl)

    // Fetch with proper headers to mimic a real browser
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    })

    const responseTime = Date.now() - startTime
    const html = await response.text()

    // Parse HTML content
    const data = parseHTMLContent(html, normalizedUrl, {
      hasSSL: normalizedUrl.startsWith("https://"),
      responseTime,
      statusCode: response.status,
      contentType: response.headers.get("content-type") || "",
      charset: extractCharset(response.headers.get("content-type") || ""),
      serverHeaders: Object.fromEntries(response.headers.entries()),
    })

    return data
  } catch (error: any) {
    console.error("Error scraping website:", error)
    throw new Error(`Failed to scrape website: ${error.message}`)
  }
}

function parseHTMLContent(
  html: string,
  url: string,
  technicalInfo: ScrapedWebsiteData["technicalInfo"],
): ScrapedWebsiteData {
  // Create a simple HTML parser using regex and string manipulation
  // This is a lightweight alternative to using a full DOM parser

  const metaTags = extractMetaTags(html)
  const headings = extractHeadings(html)
  const links = extractLinks(html, url)
  const images = extractImages(html, url)
  const scripts = extractScripts(html)
  const styles = extractStyles(html)
  const content = extractContent(html)

  // Determine the best title from multiple sources
  const title = determineBestTitle(metaTags, headings, content.textContent, url)

  return {
    title,
    description: metaTags.description || metaTags.ogDescription || content.paragraphs[0]?.substring(0, 160) || "",
    keywords: extractKeywords(metaTags.keywords, content.textContent),
    headings,
    metaTags,
    links,
    images,
    scripts,
    styles,
    content,
    technicalInfo,
  }
}

function extractMetaTags(html: string) {
  const metaTags: ScrapedWebsiteData["metaTags"] = {}

  // Extract title tag
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is)
  if (titleMatch) {
    metaTags.title = cleanText(titleMatch[1])
  }

  // Extract meta tags
  const metaRegex = /<meta\s+([^>]*?)>/gi
  let match
  while ((match = metaRegex.exec(html)) !== null) {
    const attributes = parseAttributes(match[1])

    if (attributes.name) {
      switch (attributes.name.toLowerCase()) {
        case "description":
          metaTags.description = cleanText(attributes.content || "")
          break
        case "keywords":
          metaTags.keywords = cleanText(attributes.content || "")
          break
        case "author":
          metaTags.author = cleanText(attributes.content || "")
          break
        case "robots":
          metaTags.robots = cleanText(attributes.content || "")
          break
        case "viewport":
          metaTags.viewport = cleanText(attributes.content || "")
          break
      }
    }

    if (attributes.property) {
      switch (attributes.property.toLowerCase()) {
        case "og:title":
          metaTags.ogTitle = cleanText(attributes.content || "")
          break
        case "og:description":
          metaTags.ogDescription = cleanText(attributes.content || "")
          break
        case "og:image":
          metaTags.ogImage = cleanText(attributes.content || "")
          break
        case "twitter:title":
          metaTags.twitterTitle = cleanText(attributes.content || "")
          break
        case "twitter:description":
          metaTags.twitterDescription = cleanText(attributes.content || "")
          break
        case "twitter:image":
          metaTags.twitterImage = cleanText(attributes.content || "")
          break
      }
    }
  }

  return metaTags
}

function extractHeadings(html: string) {
  const headings = { h1: [], h2: [], h3: [] } as ScrapedWebsiteData["headings"]

  // Extract H1 tags
  const h1Regex = /<h1[^>]*>(.*?)<\/h1>/gi
  let match
  while ((match = h1Regex.exec(html)) !== null) {
    const text = cleanText(stripHTML(match[1]))
    if (text) headings.h1.push(text)
  }

  // Extract H2 tags
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi
  while ((match = h2Regex.exec(html)) !== null) {
    const text = cleanText(stripHTML(match[1]))
    if (text) headings.h2.push(text)
  }

  // Extract H3 tags
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>/gi
  while ((match = h3Regex.exec(html)) !== null) {
    const text = cleanText(stripHTML(match[1]))
    if (text) headings.h3.push(text)
  }

  return headings
}

function extractLinks(html: string, baseUrl: string) {
  const links = { internal: [], external: [] } as ScrapedWebsiteData["links"]
  const baseDomain = new URL(baseUrl).hostname

  const linkRegex = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi
  let match
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1]
    if (href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
      try {
        const url = new URL(href, baseUrl)
        if (url.hostname === baseDomain) {
          links.internal.push(url.href)
        } else {
          links.external.push(url.href)
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }
  }

  return {
    internal: [...new Set(links.internal)],
    external: [...new Set(links.external)],
  }
}

function extractImages(html: string, baseUrl: string) {
  const images: ScrapedWebsiteData["images"] = []

  const imgRegex = /<img\s+([^>]*?)>/gi
  let match
  while ((match = imgRegex.exec(html)) !== null) {
    const attributes = parseAttributes(match[1])
    if (attributes.src) {
      try {
        const src = new URL(attributes.src, baseUrl).href
        images.push({
          src,
          alt: cleanText(attributes.alt || ""),
          title: cleanText(attributes.title || ""),
        })
      } catch (e) {
        // Invalid URL, skip
      }
    }
  }

  return images
}

function extractScripts(html: string) {
  const scripts: string[] = []
  const scriptRegex = /<script\s+[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi
  let match
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1])
  }
  return [...new Set(scripts)]
}

function extractStyles(html: string) {
  const styles: string[] = []
  const linkRegex = /<link\s+[^>]*rel\s*=\s*["']stylesheet["'][^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi
  let match
  while ((match = linkRegex.exec(html)) !== null) {
    styles.push(match[1])
  }
  return [...new Set(styles)]
}

function extractContent(html: string) {
  // Remove script and style tags
  let content = html.replace(/<script[^>]*>.*?<\/script>/gis, "")
  content = content.replace(/<style[^>]*>.*?<\/style>/gis, "")

  // Extract text content
  const textContent = cleanText(stripHTML(content))

  // Extract paragraphs
  const paragraphs: string[] = []
  const pRegex = /<p[^>]*>(.*?)<\/p>/gi
  let match
  while ((match = pRegex.exec(html)) !== null) {
    const text = cleanText(stripHTML(match[1]))
    if (text && text.length > 20) {
      paragraphs.push(text)
    }
  }

  return {
    textContent,
    wordCount: textContent.split(/\s+/).filter((word) => word.length > 0).length,
    paragraphs,
  }
}

function determineBestTitle(
  metaTags: ScrapedWebsiteData["metaTags"],
  headings: ScrapedWebsiteData["headings"],
  content: string,
  url: string,
): string {
  // Enhanced Google-like title selection algorithm
  // Google typically uses a combination of title tag, headings, and content
  // with preference for shorter, more descriptive titles

  // Collect all potential titles
  const potentialTitles: { title: string; priority: number; length: number }[] = []

  // 1. Title tag (highest priority for Google)
  if (metaTags.title) {
    potentialTitles.push({
      title: metaTags.title,
      priority: 10,
      length: metaTags.title.length,
    })
  }

  // 2. Open Graph title (often used by Google for social sharing context)
  if (metaTags.ogTitle) {
    potentialTitles.push({
      title: metaTags.ogTitle,
      priority: 9,
      length: metaTags.ogTitle.length,
    })
  }

  // 3. Twitter title
  if (metaTags.twitterTitle) {
    potentialTitles.push({
      title: metaTags.twitterTitle,
      priority: 8,
      length: metaTags.twitterTitle.length,
    })
  }

  // 4. First H1 tag (often used when title tag is missing or generic)
  if (headings.h1.length > 0) {
    potentialTitles.push({
      title: headings.h1[0],
      priority: 7,
      length: headings.h1[0].length,
    })
  }

  // 5. Other H1 tags
  headings.h1.slice(1).forEach((h1) => {
    potentialTitles.push({
      title: h1,
      priority: 6,
      length: h1.length,
    })
  })

  // 6. First H2 tag
  if (headings.h2.length > 0) {
    potentialTitles.push({
      title: headings.h2[0],
      priority: 5,
      length: headings.h2[0].length,
    })
  }

  // If no titles found, extract from domain
  if (potentialTitles.length === 0) {
    try {
      const domain = new URL(url).hostname
      const siteName = domain.replace(/^www\./, "").split(".")[0]
      const formattedSiteName = siteName.charAt(0).toUpperCase() + siteName.slice(1)

      return formattedSiteName
    } catch (e) {
      return "Website Analysis"
    }
  }

  // Filter out very long or very short titles
  const filteredTitles = potentialTitles.filter((t) => t.title.length >= 10 && t.title.length <= 70)

  // If all titles were filtered out, use the original list
  const titleList = filteredTitles.length > 0 ? filteredTitles : potentialTitles

  // Sort by priority first, then prefer titles between 30-60 chars (ideal for Google)
  titleList.sort((a, b) => {
    // First sort by priority
    if (a.priority !== b.priority) {
      return b.priority - a.priority
    }

    // Then prefer titles in the ideal length range
    const aIdealLength = a.length >= 30 && a.length <= 60
    const bIdealLength = b.length >= 30 && b.length <= 60

    if (aIdealLength && !bIdealLength) return -1
    if (!aIdealLength && bIdealLength) return 1

    // If both are ideal or both are not ideal, prefer shorter titles
    return a.length - b.length
  })

  // Return the best title
  return titleList[0].title
}

function extractKeywords(metaKeywords: string | undefined, content: string): string[] {
  const keywords: string[] = []

  // Add meta keywords if available
  if (metaKeywords) {
    keywords.push(
      ...metaKeywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
    )
  }

  // Extract keywords from content using simple frequency analysis
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && word.length < 20)

  const wordFreq: Record<string, number> = {}
  words.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })

  // Get top frequent words
  const topWords = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)

  keywords.push(...topWords)

  return [...new Set(keywords)].slice(0, 20)
}

function parseAttributes(attributeString: string): Record<string, string> {
  const attributes: Record<string, string> = {}
  const attrRegex = /(\w+)\s*=\s*["']([^"']*)["']/g
  let match
  while ((match = attrRegex.exec(attributeString)) !== null) {
    attributes[match[1]] = match[2]
  }
  return attributes
}

function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, " ")
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function extractCharset(contentType: string): string {
  const match = contentType.match(/charset=([^;]+)/i)
  return match ? match[1].trim() : "utf-8"
}

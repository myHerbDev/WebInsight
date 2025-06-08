import type * as cheerio from "cheerio"

interface AnalysisResult {
  _id?: string
  url: string
  title: string | null
  summary: string | null
  key_points: string[]
  keywords: string[]
  sustainability_score: number
  performance_score: number
  content_quality_score: number
  script_optimization_score: number
  improvements: string[]
  content_stats: {
    word_count: number
    char_count: number
    images_count: number
    links_count: number
    headings_count: number
    paragraphs_count: number
    lists_count: number
    forms_count: number
    videos_count: number
    social_links_count: number
  }
  hosting: {
    provider: string | null
    ipAddress: string | null
    location: string | null
    serverType: string | null
    responseTime: number | null
  }
  metadata: {
    title: string | null
    description: string | null
    keywords: string[] | null
    favicon: string | null
    language: string | null
    author: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
    twitterCard: string | null
    canonicalUrl: string | null
    robots: string | null
    viewport: string | null
    themeColor: string | null
    generator: string | null
  }
  performance: {
    pageSize: number
    httpRequests: number
    resourceCounts: {
      html: number
      css: number
      js: number
      images: number
      fonts: number
      videos: number
      other: number
    }
    loadTime: number | null
    compressionEnabled: boolean
    cachingEnabled: boolean
    minificationDetected: boolean
  }
  security: {
    httpsEnabled: boolean
    httpHeaders: Record<string, string> | null
    mixedContent: boolean
    serverSignature: string | null
    sslInfo: {
      issuer: string | null
      validFrom: string | null
      validTo: string | null
      protocol: string | null
    } | null
    securityScore: number
  }
  technologies: Array<{
    name: string
    category: string
    version?: string | null
    confidence?: number | null
    description?: string | null
  }> | null
  links: {
    internalLinks: number
    externalLinks: number
    nofollowLinks: number
    brokenLinksEstimate: number
    socialMediaLinks: string[]
    emailLinks: number
    phoneLinks: number
  }
  contentAnalysis: {
    wordCount: number
    charCount: number
    imagesCount: number
    videosCount: number
    readabilityScore: number | null
    sentimentScore: number | null
    topKeywords: string[]
    headingsStructure: Record<string, Array<{ text: string; level: number }>> | null
    contentSections: string[]
    languageDetected: string | null
    duplicateContentPercentage: number | null
  }
  seoAnalysis: {
    titleLength: number | null
    descriptionLength: number | null
    h1Count: number
    h2Count: number
    imageAltCount: number
    imagesMissingAlt: number
    internalLinkCount: number
    externalLinkCount: number
    keywordDensity: Record<string, number>
    metaTagsPresent: string[]
    structuredDataPresent: boolean
    sitemapDetected: boolean
    robotsTxtDetected: boolean
    seoScore: number
  }
  accessibility: {
    altTextCoverage: number
    headingStructureValid: boolean
    colorContrastIssues: number | null
    keyboardNavigationSupport: boolean | null
    ariaLabelsPresent: boolean
    accessibilityScore: number
  }
  mobileFriendliness: {
    viewportConfigured: boolean
    responsiveDesign: boolean
    mobileOptimized: boolean
    touchTargetsAdequate: boolean | null
    mobileScore: number
  }
  businessInfo: {
    industry: string | null
    businessType: string | null
    targetAudience: string | null
    primaryPurpose: string | null
    contactInfo: {
      email: string | null
      phone: string | null
      address: string | null
      socialMedia: Record<string, string>
    }
  }
}

function extractSecurityHeaders(headers: Headers): Record<string, string> {
  const securityHeaders: Record<string, string> = {}
  const commonSecHeaders = [
    "strict-transport-security",
    "content-security-policy",
    "x-frame-options",
    "x-content-type-options",
    "referrer-policy",
    "permissions-policy",
    "x-xss-protection",
    "expect-ct",
    "feature-policy",
  ]

  commonSecHeaders.forEach((header) => {
    const value = headers.get(header)
    if (value) {
      securityHeaders[header] = value
    }
  })

  return securityHeaders
}

async function detectHostingProvider(
  ipAddress: string,
  hostname: string,
): Promise<{
  provider: string | null
  location: string | null
  serverType: string | null
}> {
  let provider: string | null = null
  const serverType: string | null = null
  const location: string | null = null

  // Enhanced pattern matching for hosting providers
  const hostingPatterns = [
    { pattern: /amazonaws\.com|aws/i, name: "Amazon Web Services" },
    { pattern: /googleusercontent\.com|google|gcp/i, name: "Google Cloud Platform" },
    { pattern: /azure|microsoft/i, name: "Microsoft Azure" },
    { pattern: /cloudflare/i, name: "Cloudflare" },
    { pattern: /digitalocean/i, name: "DigitalOcean" },
    { pattern: /linode/i, name: "Linode" },
    { pattern: /vercel\.app|vercel\.com/i, name: "Vercel" },
    { pattern: /netlify\.app|netlify\.com/i, name: "Netlify" },
    { pattern: /heroku/i, name: "Heroku" },
    { pattern: /github\.io|github/i, name: "GitHub Pages" },
    { pattern: /firebase/i, name: "Firebase Hosting" },
    { pattern: /surge\.sh/i, name: "Surge" },
    { pattern: /now\.sh/i, name: "Vercel (Zeit)" },
    { pattern: /godaddy/i, name: "GoDaddy" },
    { pattern: /bluehost/i, name: "Bluehost" },
    { pattern: /hostgator/i, name: "HostGator" },
    { pattern: /siteground/i, name: "SiteGround" },
    { pattern: /wpengine/i, name: "WP Engine" },
  ]

  for (const { pattern, name } of hostingPatterns) {
    if (pattern.test(hostname)) {
      provider = name
      break
    }
  }

  return { provider, location, serverType }
}

function detectTechnologies(
  $: cheerio.CheerioAPI,
  html: string,
  headers: Headers | null,
): Array<{
  name: string
  category: string
  version?: string | null
  confidence?: number | null
  description?: string | null
}> {
  const technologies: Array<{
    name: string
    category: string
    version?: string | null
    confidence?: number | null
    description?: string | null
  }> = []

  // JavaScript Libraries and Frameworks
  if ($('script[src*="jquery"]').length || html.includes("jQuery")) {
    const version = html.match(/jquery[/-](\d+\.\d+\.\d+)/i)?.[1]
    technologies.push({
      name: "jQuery",
      category: "JavaScript Library",
      version,
      confidence: 95,
      description: "Fast, small, and feature-rich JavaScript library",
    })
  }

  if ($('script[src*="react"]').length || html.includes("React")) {
    technologies.push({
      name: "React",
      category: "JavaScript Framework",
      confidence: 90,
      description: "JavaScript library for building user interfaces",
    })
  }

  if ($('script[src*="vue"]').length || html.includes("Vue")) {
    technologies.push({
      name: "Vue.js",
      category: "JavaScript Framework",
      confidence: 90,
      description: "Progressive JavaScript framework",
    })
  }

  if ($('script[src*="angular"]').length || html.includes("Angular")) {
    technologies.push({
      name: "Angular",
      category: "JavaScript Framework",
      confidence: 90,
      description: "Platform for building mobile and desktop web applications",
    })
  }

  // Content Management Systems
  if (html.includes("wp-content") || html.includes("wordpress")) {
    technologies.push({
      name: "WordPress",
      category: "CMS",
      confidence: 95,
      description: "Open source content management system",
    })
  }

  if (html.includes("Drupal") || $('meta[name="generator"][content*="Drupal"]').length) {
    technologies.push({
      name: "Drupal",
      category: "CMS",
      confidence: 90,
      description: "Open source content management platform",
    })
  }

  if (html.includes("Joomla") || $('meta[name="generator"][content*="Joomla"]').length) {
    technologies.push({
      name: "Joomla",
      category: "CMS",
      confidence: 90,
      description: "Open source content management system",
    })
  }

  // E-commerce Platforms
  if (html.includes("Shopify") || $('script[src*="shopify"]').length) {
    technologies.push({
      name: "Shopify",
      category: "eCommerce",
      confidence: 95,
      description: "Commerce platform for online stores",
    })
  }

  if (html.includes("WooCommerce") || $('script[src*="woocommerce"]').length) {
    technologies.push({
      name: "WooCommerce",
      category: "eCommerce",
      confidence: 90,
      description: "WordPress eCommerce plugin",
    })
  }

  // Analytics and Tracking
  if ($('script[src*="google-analytics"]').length || html.includes("gtag") || html.includes("ga(")) {
    technologies.push({
      name: "Google Analytics",
      category: "Analytics",
      confidence: 95,
      description: "Web analytics service",
    })
  }

  if ($('script[src*="gtm"]').length || html.includes("googletagmanager")) {
    technologies.push({
      name: "Google Tag Manager",
      category: "Tag Management",
      confidence: 95,
      description: "Tag management system",
    })
  }

  // Web Servers
  const serverHeader = headers?.get("server")
  if (serverHeader) {
    if (serverHeader.toLowerCase().includes("nginx")) {
      technologies.push({
        name: "Nginx",
        category: "Web Server",
        confidence: 100,
        description: "HTTP and reverse proxy server",
      })
    } else if (serverHeader.toLowerCase().includes("apache")) {
      technologies.push({
        name: "Apache",
        category: "Web Server",
        confidence: 100,
        description: "HTTP server software",
      })
    } else if (serverHeader.toLowerCase().includes("cloudflare")) {
      technologies.push({
        name: "Cloudflare",
        category: "CDN",
        confidence: 100,
        description: "Web infrastructure and website security company",
      })
    }
  }

  // CSS Frameworks
  if (html.includes("bootstrap") || $('link[href*="bootstrap"]').length) {
    technologies.push({
      name: "Bootstrap",
      category: "CSS Framework",
      confidence: 90,
      description: "CSS framework for responsive design",
    })
  }

  if (html.includes("tailwind") || $('link[href*="tailwind"]').length) {
    technologies.push({
      name: "Tailwind CSS",
      category: "CSS Framework",
      confidence: 90,
      description: "Utility-first CSS framework",
    })
  }

  return technologies
}

function calculateAdvancedScores(
  $: cheerio.CheerioAPI,
  html: string,
  responseHeaders: Headers | null,
  httpsEnabled: boolean,
  contentStats: any,
  metadata: any,
): {
  sustainability_score: number
  performance_score: number
  content_quality_score: number
  script_optimization_score: number
  seo_score: number
  security_score: number
  accessibility_score: number
  mobile_score: number
} {
  // Enhanced Sustainability Score (0-100)
  let sustainabilityScore = 50
  const pageSize = Buffer.from(html).length / 1024

  if (pageSize < 100) sustainabilityScore += 25
  else if (pageSize < 500) sustainabilityScore += 15
  else if (pageSize < 1000) sustainabilityScore += 5
  else if (pageSize > 2000) sustainabilityScore -= 20

  const imageCount = $("img").length
  if (imageCount < 10) sustainabilityScore += 15
  else if (imageCount > 50) sustainabilityScore -= 15

  if (httpsEnabled) sustainabilityScore += 10
  if (responseHeaders?.get("content-encoding")?.includes("gzip")) sustainabilityScore += 10

  // Enhanced Performance Score (0-100)
  let performanceScore = 60
  const scriptCount = $("script").length
  const cssCount = $('link[rel="stylesheet"]').length

  if (scriptCount < 5) performanceScore += 20
  else if (scriptCount < 10) performanceScore += 10
  else if (scriptCount > 20) performanceScore -= 25

  if (cssCount < 3) performanceScore += 15
  else if (cssCount > 10) performanceScore -= 15

  if (pageSize < 200) performanceScore += 20
  else if (pageSize > 1000) performanceScore -= 30

  if (responseHeaders?.get("cache-control")) performanceScore += 15
  if ($("script[async], script[defer]").length > 0) performanceScore += 10

  // Enhanced Content Quality Score (0-100)
  let contentQualityScore = 40
  const title = metadata.title
  const description = metadata.description
  const h1Count = $("h1").length
  const wordCount = contentStats.word_count

  if (title && title.length > 10 && title.length < 60) contentQualityScore += 20
  if (description && description.length > 50 && description.length < 160) contentQualityScore += 20
  if (h1Count === 1) contentQualityScore += 15
  else if (h1Count === 0 || h1Count > 3) contentQualityScore -= 15

  if (wordCount > 300) contentQualityScore += 15
  if (wordCount > 1000) contentQualityScore += 10
  if ($("img[alt]").length === imageCount && imageCount > 0) contentQualityScore += 15

  // Enhanced Script Optimization Score (0-100)
  let scriptOptScore = 70
  const inlineScripts = $("script:not([src])").length
  const externalScripts = $("script[src]").length

  if (inlineScripts < 3) scriptOptScore += 20
  else if (inlineScripts > 10) scriptOptScore -= 25

  if (externalScripts < 5) scriptOptScore += 15
  else if (externalScripts > 15) scriptOptScore -= 30

  if ($("script[async], script[defer]").length > 0) scriptOptScore += 10
  if ($("script[type='module']").length > 0) scriptOptScore += 5

  // SEO Score (0-100)
  let seoScore = 50
  if (title && title.length > 0) seoScore += 15
  if (description && description.length > 0) seoScore += 15
  if (h1Count === 1) seoScore += 10
  if ($('meta[name="keywords"]').length) seoScore += 5
  if ($('link[rel="canonical"]').length) seoScore += 10
  if ($("img[alt]").length === imageCount) seoScore += 15

  // Security Score (0-100)
  let securityScore = 30
  if (httpsEnabled) securityScore += 30
  const secHeaders = extractSecurityHeaders(responseHeaders || new Headers())
  securityScore += Object.keys(secHeaders).length * 5
  if (!$('script[src^="http:"]').length) securityScore += 10

  // Accessibility Score (0-100)
  let accessibilityScore = 40
  if ($("img[alt]").length === imageCount) accessibilityScore += 20
  if ($("html[lang]").length) accessibilityScore += 15
  if ($("label").length > 0) accessibilityScore += 10
  if ($("[aria-label], [aria-labelledby]").length > 0) accessibilityScore += 15

  // Mobile Score (0-100)
  let mobileScore = 50
  if ($('meta[name="viewport"]').length) mobileScore += 25
  if ($('link[rel="stylesheet"][media*="screen"]').length) mobileScore += 15
  if (pageSize < 500) mobileScore += 10

  return {
    sustainability_score: Math.max(0, Math.min(100, sustainabilityScore)),
    performance_score: Math.max(0, Math.min(100, performanceScore)),
    content_quality_score: Math.max(0, Math.min(100, contentQualityScore)),
    script_optimization_score: Math.max(0, Math.min(100, scriptOptScore)),
    seo_score: Math.max(0, Math.min(100, seoScore)),
    security_score: Math.max(0, Math.min(100, securityScore)),
    accessibility_score: Math.max(0, Math.min(100, accessibilityScore)),
    mobile_score: Math.max(0, Math.min(100, mobileScore)),
  }
}

function generateComprehensiveImprovements(
  $: cheerio.CheerioAPI,
  html: string,
  responseHeaders: Headers | null,
  httpsEnabled: boolean,
  scores: any,
): string[] {
  const improvements: string[] = []

  // Security improvements
  if (!httpsEnabled) {
    improvements.push("🔒 Enable HTTPS to secure data transmission and improve SEO rankings")
  }

  const securityHeaders = extractSecurityHeaders(responseHeaders || new Headers())
  if (!securityHeaders["strict-transport-security"]) {
    improvements.push("🛡️ Add HSTS header to prevent protocol downgrade attacks")
  }
  if (!securityHeaders["content-security-policy"]) {
    improvements.push("🔐 Implement Content Security Policy (CSP) to prevent XSS attacks")
  }

  // Performance improvements
  const pageSize = Buffer.from(html).length / 1024
  if (pageSize > 1000) {
    improvements.push(
      "⚡ Optimize page size - current size exceeds 1MB, consider image compression and code minification",
    )
  }

  const scriptCount = $("script").length
  if (scriptCount > 15) {
    improvements.push("📦 Reduce JavaScript files by bundling and removing unused scripts")
  }

  if (!responseHeaders?.get("cache-control")) {
    improvements.push("🗄️ Add caching headers to improve repeat visit performance")
  }

  if (!responseHeaders?.get("content-encoding")) {
    improvements.push("🗜️ Enable Gzip compression to reduce file transfer sizes")
  }

  // SEO improvements
  const title = $("title").text().trim()
  if (!title) {
    improvements.push("📝 Add a descriptive page title for better SEO")
  } else if (title.length > 60) {
    improvements.push("✂️ Shorten page title to under 60 characters for better search display")
  }

  const description = $('meta[name="description"]').attr("content")
  if (!description) {
    improvements.push("📄 Add meta description to improve search engine snippets")
  } else if (description.length > 160) {
    improvements.push("📏 Optimize meta description length to 150-160 characters")
  }

  const h1Count = $("h1").length
  if (h1Count === 0) {
    improvements.push("🏷️ Add an H1 heading to improve content structure and SEO")
  } else if (h1Count > 1) {
    improvements.push("🎯 Use only one H1 heading per page for better SEO")
  }

  // Accessibility improvements
  const imageCount = $("img").length
  const imagesWithoutAlt = $("img:not([alt])").length
  if (imagesWithoutAlt > 0) {
    improvements.push(`♿ Add alt text to ${imagesWithoutAlt} images for better accessibility`)
  }

  if (!$("html[lang]").length) {
    improvements.push("🌐 Add language attribute to HTML element for screen readers")
  }

  // Content improvements
  const wordCount = $("body").text().replace(/\s+/g, " ").trim().split(/\s+/).length
  if (wordCount < 300) {
    improvements.push("📚 Increase content length - pages with more content typically rank better")
  }

  // Mobile improvements
  if (!$('meta[name="viewport"]').length) {
    improvements.push("📱 Add viewport meta tag for proper mobile display")
  }

  // Technical improvements
  if ($("script:not([async]):not([defer])").length > 5) {
    improvements.push("⚡ Add async or defer attributes to non-critical JavaScript")
  }

  if (!$('link[rel="canonical"]').length) {
    improvements.push("🔗 Add canonical URL to prevent duplicate content issues")
  }

  return improvements.slice(0, 10) // Return top 10 improvements
}

function extractBusinessInfo($: cheerio.CheerioAPI, html: string): any {
  const businessInfo = {
    industry: null,
    businessType: null,
    targetAudience: null,
    primaryPurpose: null,
    contactInfo: {
      email: null,
      phone: null,
      address: null,
      socialMedia: {},
    },
  }

  // Extract contact information
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const phoneRegex = /(\+?1?[-.\s]?)?$$?([0-9]{3})$$?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g

  const emails = html.match(emailRegex)
  const phones = html.match(phoneRegex)

  if (emails && emails.length > 0) {
    businessInfo.contactInfo.email = emails[0]
  }

  if (phones && phones.length > 0) {
    businessInfo.contactInfo.phone = phones[0]
  }

  // Extract social media links
  const socialPatterns = {
    facebook: /facebook\.com\/[a-zA-Z0-9.]+/,
    twitter: /twitter\.com\/[a-zA-Z0-9_]+/,
    linkedin: /linkedin\.com\/[a-zA-Z0-9/-]+/,
    instagram: /instagram\.com\/[a-zA-Z0-9_.]+/,
    youtube: /youtube\.com\/[a-zA-Z0-9/-]+/,
  }

  Object.entries(socialPatterns).forEach(([platform, pattern]) => {
    const match = html.match(pattern)
    if (match) {
      businessInfo.contactInfo.socialMedia[platform] = `https://${match[0]}`
    }
  })

  return businessInfo
}

// Simple analyzer fallback for build compatibility
export async function analyzeWebsite(url: string) {
  // This is a placeholder - the actual analysis is done in the API route
  throw new Error("Use API route for analysis")
}

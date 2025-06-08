export interface WebsiteMetadata {
  title?: string | null
  description?: string | null
  keywords?: string[] | null
  favicon?: string | null
  ogImage?: string | null
  language?: string | null
  canonicalUrl?: string | null
  charSet?: string | null
  viewport?: string | null
  themeColor?: string | null
  robots?: string | null // Content of robots meta tag
  generator?: string | null // CMS or site generator
  jsonLd?: any[] | null // Parsed JSON-LD scripts
  dublinCore?: Record<string, string | string[]> | null // Parsed Dublin Core meta tags
}

export interface HostingInfo {
  provider?: string | null
  ipAddress?: string | null
  location?: string | null // City, Region, Country
  serverType?: string | null // e.g., Apache, Nginx
  asn?: string | null // Autonomous System Number
  ipOrganization?: string | null
  countryCode?: string | null
}

export interface PerformanceMetrics {
  loadTime?: number | null // milliseconds
  pageSize?: number | null // KB
  ttfb?: number | null // Time to First Byte (ms)
  fcp?: number | null // First Contentful Paint (ms)
  lcp?: number | null // Largest Contentful Paint (ms)
  cls?: number | null // Cumulative Layout Shift
  speedIndex?: number | null // (ms)
  interactiveTime?: number | null // Time to Interactive (ms)
  httpRequests?: number | null
  lighthouseScore?: {
    performance?: number | null // 0-100
    accessibility?: number | null
    bestPractices?: number | null
    seo?: number | null
    pwa?: number | null // If applicable
  } | null
  resourceCounts?: {
    html?: number
    css?: number
    js?: number
    images?: number
    fonts?: number
    videos?: number
    other?: number
  } | null
  imageOptimization?: {
    optimizableImages?: number
    potentialSavingsKb?: number
  } | null
  caching?: {
    hasCachingHeaders?: boolean
    cachePolicy?: string | null // e.g. "public, max-age=3600"
  } | null
  compression?: {
    usesGzip?: boolean
    usesBrotli?: boolean
  } | null
}

export interface SecurityInfo {
  httpsEnabled?: boolean
  sslIssuer?: string | null
  sslValidFrom?: string | null // ISO Date
  sslExpiryDate?: string | null // ISO Date
  tlsVersion?: string | null // e.g. TLS 1.3
  httpHeaders?: Record<string, string> | null // Key-value of important security headers
  vulnerabilitiesFound?: boolean
  vulnerabilities?: Array<{ name: string; severity: "High" | "Medium" | "Low" | "Info" }> | null
  mixedContent?: boolean
  serverSignature?: string | null
  csp?: string | null // Content Security Policy details
  hsts?: boolean // HTTP Strict Transport Security enabled
  dnssecEnabled?: boolean | null // Placeholder
  cookies?: Array<{ name: string; secure: boolean; httpOnly: boolean; sameSite?: string }> | null
}

export interface SustainabilityInfo {
  isGreenHosting?: boolean | null
  carbonEmissions?: number | null // g CO2e per page view
  energySource?: string | null // e.g., Renewable, Mixed
  pageWeightEcoIndex?: number | null // 0-100
  dataTransferBytes?: number | null
}

export interface Technology {
  name: string
  category: string // e.g., CMS, JavaScript Framework, Analytics, Web Server
  version?: string | null
  confidence?: number | null // 0-100
}

export interface TrafficInfo {
  // These usually require paid APIs
  globalRank?: number | null
  countryRank?: number | null
  monthlyVisits?: number | null
  bounceRate?: number | null // Percentage
  avgVisitDuration?: number | null // seconds
  pagesPerVisit?: number | null
  topTrafficSources?: Record<string, number> | null // e.g., { direct: 50, search: 30, social: 20 }
  topReferringSites?: string[] | null
  topKeywords?: string[] | null // Organic search keywords
}

export interface DomainInfo {
  registrar?: string | null
  registrationDate?: string | null // ISO Date
  expiryDate?: string | null // ISO Date
  nameservers?: string[] | null
  domainAge?: string | null // e.g., "5 years, 3 months"
  status?: string[] | null // e.g., ["clientTransferProhibited"]
  dnsRecords?: {
    A?: string[]
    AAAA?: string[]
    MX?: Array<{ priority: number; exchange: string }>
    TXT?: string[]
    NS?: string[]
    CNAME?: string
  } | null // Basic DNS records
}

export interface LinkInfo {
  internalLinks?: number
  externalLinks?: number
  brokenLinks?: number // Count of detected broken links
  nofollowLinks?: number
  // Example of more detailed link data (would require extensive crawling)
  // topInternalAnchors?: Record<string, number> | null;
  // topExternalDomains?: Record<string, number> | null;
}

export interface ContentAnalysis {
  wordCount?: number
  charCount?: number
  readabilityScore?: {
    fleschKincaidGrade?: number | null
    // Add other scores if available
  } | null
  sentiment?: {
    score?: number | null // e.g., -1 to 1
    label?: "Positive" | "Negative" | "Neutral" | null
  } | null
  headingsStructure?: Record<string, Array<{ text: string; level: number }>> | null // h1: [{text, level}], h2: [...]
  imagesCount?: number
  imagesMissingAlt?: number | null
  videosCount?: number
  hasSitemapXml?: boolean | null // True if /sitemap.xml is found and valid
  sitemapEntries?: number | null
  hasRobotsTxt?: boolean | null // True if /robots.txt is found
  robotsTxtRules?: string[] | null // Key rules from robots.txt
  duplicateContentPercentage?: number | null // Estimated
  languageVariety?: string[] | null // Detected languages in content
}

export interface AccessibilityInfo {
  // Basic checks, full audit needs tools like Axe
  ariaAttributesPresent?: boolean | null
  imageAltTextCoverage?: number | null // Percentage of images with alt text
  formLabelCoverage?: number | null // Percentage of form inputs with labels
  contrastRatioIssues?: number | null // Count of low contrast elements (conceptual)
  keyboardNavigable?: boolean | null // Basic check
  wcagConformanceLevel?: "A" | "AA" | "AAA" | "Fail" | null // Estimated
}

export interface MobileFriendliness {
  isMobileFriendly?: boolean | null // Based on viewport, responsive design cues
  viewportMetaPresent?: boolean
  tapTargetSizeAdequate?: boolean | null // Conceptual
  fontSizeAdequate?: boolean | null // Conceptual
}

export interface SocialPresence {
  facebook?: string | null // URL to Facebook page
  twitter?: string | null // URL to Twitter profile
  linkedin?: string | null // URL to LinkedIn page
  instagram?: string | null // URL to Instagram profile
  youtube?: string | null // URL to YouTube channel
  // Add others like Pinterest, TikTok, etc.
}

export interface WebsiteData {
  _id: string // Unique ID for the analysis
  url: string
  analysisDate: string // ISO Date string

  metadata?: WebsiteMetadata | null
  hosting?: HostingInfo | null
  performance?: PerformanceMetrics | null
  security?: SecurityInfo | null
  sustainability?: SustainabilityInfo | null
  technologies?: Technology[] | null
  traffic?: TrafficInfo | null
  domain?: DomainInfo | null
  links?: LinkInfo | null
  contentAnalysis?: ContentAnalysis | null
  accessibility?: AccessibilityInfo | null // NEW
  mobileFriendliness?: MobileFriendliness | null // NEW
  socialPresence?: SocialPresence | null // NEW

  // Optional: Raw HTML for certain advanced analyses or debugging
  // rawHtmlSnapshot?: string | null;

  // Optional: Screenshots
  // screenshotDesktopUrl?: string | null;
  // screenshotMobileUrl?: string | null;

  // Legacy fields for simpler summaries or backward compatibility if needed
  title?: string | null
  summary?: string | null
  keywords?: string[] | null
  performance_score?: number | null
  // ... any other top-level summary fields you might want
}

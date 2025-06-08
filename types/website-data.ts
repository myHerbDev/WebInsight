export interface WebsiteMetadata {
  title?: string | null
  description?: string | null
  keywords?: string[] | null
  favicon?: string | null
  ogImage?: string | null
  language?: string | null
}

export interface HostingInfo {
  provider?: string | null
  ipAddress?: string | null
  location?: string | null
  serverType?: string | null // e.g., Apache, Nginx
  asn?: string | null
}

export interface PerformanceMetrics {
  loadTime?: number | null // ms
  pageSize?: number | null // KB
  ttfb?: number | null // Time to First Byte (ms)
  fcp?: number | null // First Contentful Paint (ms)
  lcp?: number | null // Largest Contentful Paint (ms)
  cls?: number | null // Cumulative Layout Shift
  speedIndex?: number | null // ms
  interactiveTime?: number | null // ms
  httpRequests?: number | null
  lighthouseScore?: number | null // 0-100
}

export interface SecurityInfo {
  httpsEnabled?: boolean
  sslIssuer?: string | null
  sslValidFrom?: string | null // ISO Date string
  sslExpiryDate?: string | null // ISO Date string
  httpHeaders?: string[] | null // e.g., CSP, HSTS
  vulnerabilitiesFound?: boolean
  vulnerabilities?: string[] | null // List of found issues
  mixedContent?: boolean
  serverSignature?: string | null
}

export interface SustainabilityInfo {
  isGreenHosting?: boolean
  carbonEmissions?: number | null // g CO2e per page view
  energySource?: string | null // e.g., Renewable, Mixed
  pageWeightEcoIndex?: number | null // 0-100, based on page size and complexity
}

export interface TrafficInfo {
  globalRank?: number | null
  countryRank?: number | null
  monthlyVisits?: string | null // Can be a string like "1.2M" or a number
  bounceRate?: number | null // Percentage
  pagesPerVisit?: number | null
  avgVisitDuration?: string | null // e.g., "5m 30s" or number in seconds
  topKeywords?: string[] | null
}

export interface DomainInfo {
  registrar?: string | null
  registrationDate?: string | null // ISO Date string
  expiryDate?: string | null // ISO Date string
  nameservers?: string[] | null
  domainAge?: string | null // e.g., "5 years, 3 months"
  status?: string[] | null // e.g., ["clientTransferProhibited"]
}

export interface LinkInfo {
  internalLinks: number
  externalLinks: number
  brokenLinks: number
  nofollowLinks?: number
}

export interface ContentAnalysis {
  wordCount?: number
  charCount?: number
  readabilityScore?: number // e.g., Flesch-Kincaid
  sentiment?: string // e.g., Positive, Neutral, Negative
  headingsCount?: Record<string, number> // e.g., { h1: 1, h2: 5 }
  imagesCount?: number
  videosCount?: number
  hasSitemapXml?: boolean
  hasRobotsTxt?: boolean
}

export interface WebsiteData {
  _id: string // Analysis ID from your database
  url: string
  analysisDate: string // ISO Date string of when the analysis was performed

  metadata?: WebsiteMetadata | null
  hosting?: HostingInfo | null
  performance?: PerformanceMetrics | null
  security?: SecurityInfo | null
  sustainability?: SustainabilityInfo | null
  technologies?: string[] | null // List of detected technologies
  traffic?: TrafficInfo | null
  domain?: DomainInfo | null
  links?: LinkInfo | null
  contentAnalysis?: ContentAnalysis | null

  // Optional: Raw data or scores from specific tools if you integrate them
  // lighthouseReport?: any;
  // wappalyzerReport?: any;

  // For simpler display or legacy compatibility if needed
  title?: string // Fallback if metadata.title is not available
  summary?: string // Fallback if metadata.description is not available
  key_points?: string[] // From previous structure
  keywords?: string[] // Fallback if metadata.keywords is not available
  sustainability_score?: number // Legacy or aggregated score
  performance_score?: number // Legacy or aggregated score
  content_quality_score?: number // Legacy or aggregated score
  security_score?: number // Legacy or aggregated score
  improvements?: string[] // From previous structure
  content_stats?: {
    // From previous structure
    wordCount?: number
    paragraphs?: number
    headings?: number
    images?: number
    links?: number
  }
  ip_address?: string | null // Legacy
  hosting_provider_name?: string | null // Legacy
  server_location?: string | null // Legacy
}

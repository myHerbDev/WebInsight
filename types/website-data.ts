export interface WebsiteData {
  _id: string
  url: string
  title: string
  summary: string
  keyPoints: string[]
  keywords: string[]
  sustainability: {
    score: number
    performance: number // e.g., page speed impact on energy
    scriptOptimization: number // e.g., efficient scripts reduce processing
    duplicateContent: number // Can indicate wasted resources
    improvements: string[] // Specific sustainability improvements
  }
  subdomains?: string[] // Optional
  contentStats: {
    wordCount?: number
    paragraphs?: number
    headings?: number // Total headings
    h1Count?: number
    h2Count?: number
    images?: number
    links?: number // Total links
    internalLinks?: number
    externalLinks?: number
    scripts?: number
    styles?: number
    pageSize?: number // in KB
    [key: string]: any // For other dynamic stats
  }
  rawData?: {
    // Limited raw data for context, not full HTML
    metaDescription?: string
    metaKeywords?: string
    h1Texts?: string[]
    sampleParagraphs?: string[]
    [key: string]: any
  }
  // Scores (0-100)
  sustainability_score?: number
  performance_score?: number
  script_optimization_score?: number
  content_quality_score?: number // Includes SEO, readability
  security_score?: number
  accessibility_score?: number
  mobile_friendliness_score?: number

  improvements?: string[] // General improvement suggestions

  // Technical details
  hosting_provider_name?: string
  ssl_certificate?: boolean // True if SSL is valid
  server_location?: string
  ip_address?: string
  technologies?: string[] // Detected technologies

  // Timestamps
  analyzedAt?: string
}

export interface AnalysisOptions {
  includeAdvancedMetrics?: boolean
  analyzeSEO?: boolean
  checkAccessibility?: boolean
  analyzePerformance?: boolean
  checkSecurity?: boolean
  analyzeSustainability?: boolean
  includeContentAnalysis?: boolean
  checkMobileOptimization?: boolean
  analyzeLoadingSpeed?: boolean
  checkSocialMedia?: boolean
}

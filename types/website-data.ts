export interface WebsiteData {
  _id: string
  url: string
  title: string
  summary: string
  keyPoints: string[]
  keywords: string[]
  sustainability: {
    score: number
    performance: number
    scriptOptimization: number
    duplicateContent: number
    improvements: string[]
  }
  subdomains: string[]
  contentStats: {
    wordCount?: number
    paragraphs?: number
    headings?: number
    images?: number
    links?: number
    scripts?: number
    styles?: number
    [key: string]: any
  }
  rawData: {
    paragraphs?: string[]
    headings?: string[]
    links?: string[]
    images?: string[]
    [key: string]: any
  }
  // Additional fields for compatibility
  sustainability_score?: number
  performance_score?: number
  script_optimization_score?: number
  content_quality_score?: number
  security_score?: number
  improvements?: string[]
  hosting_provider_name?: string
  ssl_certificate?: boolean
  server_location?: string
  ip_address?: string
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

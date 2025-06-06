export interface WebsiteData {
  _id?: string
  url: string
  title?: string
  description?: string
  performance_score?: number
  sustainability_score?: number
  security_score?: number
  seo_score?: number
  response_time?: number
  server_location?: string
  hosting_provider_name?: string
  ssl_certificate?: boolean
  green_hosting?: boolean
  mobile_friendly?: boolean
  robots_txt?: boolean
  sitemap?: boolean
  fcp?: number
  lcp?: number
  cls?: number
  tti?: number
  technologies?: string[]
  insights?: Array<{
    type: "success" | "warning" | "error" | "info"
    title: string
    description: string
  }>
  performance_recommendations?: Array<{
    title: string
    description: string
  }>
  seo_recommendations?: Array<{
    title: string
    description: string
  }>
  sustainability?: {
    score?: number
    performance?: number
    scriptOptimization?: number
    improvements?: string[]
  }
  metaTags?: {
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
  headings?: {
    h1?: string[]
    h2?: string[]
    h3?: string[]
  }
  content?: {
    wordCount?: number
    paragraphs?: string[]
    textContent?: string
  }
  images?: Array<{
    src: string
    alt: string
    title?: string
  }>
  links?: {
    internal?: string[]
    external?: string[]
  }
  contentStats?: {
    wordCount?: number
    paragraphs?: number
    images?: number
    scripts?: number
  }
  keyPoints?: string[]
  summary?: string
}

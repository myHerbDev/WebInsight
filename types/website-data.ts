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
    wordCount: number
    paragraphs: number
    headings: number
    images: number
    links: number
  }
  screenshotUrl?: string
  rawData?: {
    paragraphs: string[]
    headings: string[]
    links: string[]
  }
  createdAt?: Date
}

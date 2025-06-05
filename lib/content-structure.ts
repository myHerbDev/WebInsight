export interface ContentSection {
  title: string
  content: string
  subsections?: ContentSection[]
}

export interface StructuredContent {
  title: string
  summary: string
  keyPoints: string[]
  sections: ContentSection[]
  conclusion: string
  metadata: {
    wordCount: number
    readingTime: number
    contentType: string
    generatedAt: string
  }
}

export function structureProfessionalContent(rawContent: string, contentType = "general"): StructuredContent {
  try {
    // Clean and normalize the content
    const cleanContent = rawContent.trim()

    if (!cleanContent) {
      throw new Error("Empty content provided")
    }

    // Split content into paragraphs
    const paragraphs = cleanContent
      .split("\n\n")
      .filter((p) => p.trim().length > 0)
      .map((p) => p.trim())

    if (paragraphs.length === 0) {
      throw new Error("No valid paragraphs found")
    }

    // Extract title (first line or generate one)
    const title = extractTitle(paragraphs[0], contentType)

    // Generate summary from first few paragraphs
    const summary = generateSummary(paragraphs)

    // Extract key points
    const keyPoints = extractKeyPoints(paragraphs)

    // Structure content into sections
    const sections = structureIntoSections(paragraphs, contentType)

    // Generate conclusion
    const conclusion = generateConclusion(paragraphs)

    // Calculate metadata
    const wordCount = cleanContent.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200) // Average reading speed

    return {
      title,
      summary,
      keyPoints,
      sections,
      conclusion,
      metadata: {
        wordCount,
        readingTime,
        contentType,
        generatedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error("Error structuring content:", error)

    // Return fallback structure
    return {
      title: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Analysis`,
      summary: rawContent.substring(0, 200) + "...",
      keyPoints: ["Content analysis completed", "Professional insights provided"],
      sections: [
        {
          title: "Analysis Results",
          content: rawContent,
        },
      ],
      conclusion: "Analysis completed successfully.",
      metadata: {
        wordCount: rawContent.split(/\s+/).length,
        readingTime: Math.ceil(rawContent.split(/\s+/).length / 200),
        contentType,
        generatedAt: new Date().toISOString(),
      },
    }
  }
}

function extractTitle(firstParagraph: string, contentType: string): string {
  // Look for title patterns
  const titlePatterns = [
    /^#\s*(.+)$/m, // Markdown heading
    /^(.+):\s*$/m, // Colon-ended title
    /^([A-Z][^.!?]*[.!?])/, // Sentence case title
  ]

  for (const pattern of titlePatterns) {
    const match = firstParagraph.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  // Generate title based on content type
  const typeMap: Record<string, string> = {
    sustainability: "Sustainability Analysis Report",
    technical: "Technical Analysis Report",
    academic: "Academic Research Document",
    executive: "Executive Summary",
    audit: "Audit Report",
    mindmap: "Mind Map Analysis",
    general: "Content Analysis",
  }

  return typeMap[contentType] || "Professional Analysis"
}

function generateSummary(paragraphs: string[]): string {
  // Take first 2-3 paragraphs for summary, limit to ~150 words
  const summaryParagraphs = paragraphs.slice(0, 3)
  const summaryText = summaryParagraphs.join(" ")

  if (summaryText.length <= 150) {
    return summaryText
  }

  // Truncate at word boundary
  const words = summaryText.split(" ")
  let summary = ""
  for (const word of words) {
    if ((summary + word).length > 147) break
    summary += (summary ? " " : "") + word
  }

  return summary + "..."
}

function extractKeyPoints(paragraphs: string[]): string[] {
  const keyPoints: string[] = []

  // Look for bullet points, numbered lists, or key statements
  for (const paragraph of paragraphs) {
    // Bullet points
    const bulletMatches = paragraph.match(/^[•\-*]\s*(.+)$/gm)
    if (bulletMatches) {
      keyPoints.push(...bulletMatches.map((match) => match.replace(/^[•\-*]\s*/, "")))
    }

    // Numbered lists
    const numberedMatches = paragraph.match(/^\d+\.\s*(.+)$/gm)
    if (numberedMatches) {
      keyPoints.push(...numberedMatches.map((match) => match.replace(/^\d+\.\s*/, "")))
    }

    // Key phrases (sentences with important keywords)
    const keyPhrases = paragraph.match(
      /[^.!?]*(?:important|key|significant|critical|essential|crucial|vital)[^.!?]*[.!?]/gi,
    )
    if (keyPhrases) {
      keyPoints.push(...keyPhrases.map((phrase) => phrase.trim()))
    }
  }

  // If no structured points found, extract first sentence of each paragraph
  if (keyPoints.length === 0) {
    for (const paragraph of paragraphs.slice(0, 5)) {
      const firstSentence = paragraph.match(/^[^.!?]*[.!?]/)
      if (firstSentence) {
        keyPoints.push(firstSentence[0].trim())
      }
    }
  }

  // Limit to 5-8 key points and ensure they're not too long
  return keyPoints
    .slice(0, 8)
    .map((point) => (point.length > 100 ? point.substring(0, 97) + "..." : point))
    .filter((point) => point.length > 10)
}

function structureIntoSections(paragraphs: string[], contentType: string): ContentSection[] {
  const sections: ContentSection[] = []
  let currentSection: ContentSection | null = null

  for (const paragraph of paragraphs) {
    // Check if this paragraph is a section header
    const isHeader = isLikelyHeader(paragraph)

    if (isHeader) {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection)
      }

      // Start new section
      currentSection = {
        title: cleanHeaderText(paragraph),
        content: "",
      }
    } else {
      // Add to current section or create default section
      if (!currentSection) {
        currentSection = {
          title: getDefaultSectionTitle(sections.length, contentType),
          content: "",
        }
      }

      currentSection.content += (currentSection.content ? "\n\n" : "") + paragraph
    }
  }

  // Add final section
  if (currentSection) {
    sections.push(currentSection)
  }

  // Ensure we have at least one section
  if (sections.length === 0) {
    sections.push({
      title: "Analysis",
      content: paragraphs.join("\n\n"),
    })
  }

  return sections
}

function isLikelyHeader(text: string): boolean {
  // Check for common header patterns
  const headerPatterns = [
    /^#{1,6}\s+/, // Markdown headers
    /^[A-Z][^.!?]*:?\s*$/, // All caps or title case without punctuation
    /^\d+\.\s*[A-Z]/, // Numbered sections
    /^[IVX]+\.\s*[A-Z]/, // Roman numerals
  ]

  return (
    headerPatterns.some((pattern) => pattern.test(text.trim())) ||
    (text.length < 60 && !text.includes(".") && /^[A-Z]/.test(text))
  )
}

function cleanHeaderText(text: string): string {
  return text
    .replace(/^#{1,6}\s*/, "") // Remove markdown headers
    .replace(/^\d+\.\s*/, "") // Remove numbering
    .replace(/^[IVX]+\.\s*/, "") // Remove roman numerals
    .replace(/:$/, "") // Remove trailing colon
    .trim()
}

function getDefaultSectionTitle(index: number, contentType: string): string {
  const defaultTitles: Record<string, string[]> = {
    sustainability: ["Overview", "Environmental Impact", "Recommendations", "Implementation"],
    technical: ["Analysis", "Findings", "Technical Details", "Recommendations"],
    academic: ["Introduction", "Methodology", "Results", "Discussion", "Conclusion"],
    executive: ["Executive Summary", "Key Findings", "Strategic Recommendations", "Next Steps"],
    audit: ["Audit Scope", "Findings", "Risk Assessment", "Recommendations"],
    general: ["Overview", "Analysis", "Key Points", "Summary"],
  }

  const titles = defaultTitles[contentType] || defaultTitles.general
  return titles[index] || `Section ${index + 1}`
}

function generateConclusion(paragraphs: string[]): string {
  // Use last paragraph if it seems like a conclusion
  const lastParagraph = paragraphs[paragraphs.length - 1]

  const conclusionKeywords = ["conclusion", "summary", "finally", "in summary", "to conclude", "overall"]
  const hasConclusion = conclusionKeywords.some((keyword) => lastParagraph.toLowerCase().includes(keyword))

  if (hasConclusion) {
    return lastParagraph
  }

  // Generate a simple conclusion
  return "This analysis provides comprehensive insights and recommendations based on the evaluated data and criteria."
}

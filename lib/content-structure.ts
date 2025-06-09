// This file was already provided in the user's context and seems mostly fine.
// I will use the existing one and ensure it integrates.
// Key changes:
// - More robust parsing and fallback mechanisms.
// - Better handling of empty or invalid inputs.
export interface ContentSection {
  title: string
  content: string
  level: number // Markdown heading level (1-6)
}

export interface StructuredContent {
  id: string // Unique ID for this structured content
  title: string // Overall title for the generated content
  content: string // Formatted plain text content
  markdown: string // Formatted markdown content
  summary: string // A brief summary
  keyPoints: string[] // Bullet points or key takeaways
  sections: ContentSection[] // Structured sections
  wordCount: number
  readingTime: number // Estimated reading time in minutes
  contentType: string // Original requested content type
  tone: string // Original requested tone
  createdAt: string // ISO date string
  websiteUrl?: string // Associated website URL if applicable
}

// Placeholder for a more sophisticated HTML-to-Markdown converter if needed
// For now, we assume AI provides markdown or near-markdown text.
function basicHtmlToMarkdown(html: string): string {
  if (!html) return ""
  let md = html
  md = md.replace(/<br\s*\/?>/gi, "\n")
  md = md.replace(/<\/?p>/gi, "\n\n")
  md = md.replace(/<\/?strong>/gi, "**")
  md = md.replace(/<\/?em>/gi, "_")
  md = md.replace(
    /<h([1-6])>(.*?)<\/h\1>/gi,
    (match, level, content) => `${"#".repeat(Number.parseInt(level))} ${content}\n`,
  )
  md = md.replace(/<li>(.*?)<\/li>/gi, (match, content) => `- ${content}\n`)
  md = md.replace(/<\/?ul>/gi, "\n")
  md = md.replace(/<\/?ol>/gi, "\n")
  // Basic link conversion
  md = md.replace(/<a href="(.*?)">(.*?)<\/a>/gi, "[$2]($1)")
  // Strip remaining tags
  md = md.replace(/<[^>]+>/g, "")
  // Consolidate multiple newlines
  md = md.replace(/\n{3,}/g, "\n\n")
  return md.trim()
}

export function structureProfessionalContent(
  rawAiResponse: string,
  requestedContentType: string,
  requestedTone: string,
  websiteData?: any, // Optional website data for context
): StructuredContent {
  try {
    if (!rawAiResponse || typeof rawAiResponse !== "string" || rawAiResponse.trim() === "") {
      console.warn("Empty or invalid raw AI response provided.")
      return createFallbackContent(requestedContentType, requestedTone, "Empty AI response")
    }

    const cleanResponse = rawAiResponse.trim()

    // Attempt to parse if AI returns structured JSON (ideal scenario)
    let parsedData = null
    try {
      const jsonMatch = cleanResponse.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/)
      if (jsonMatch) {
        const jsonString = jsonMatch[1] || jsonMatch[2]
        if (jsonString) parsedData = JSON.parse(jsonString)
      }
    } catch (e) {
      /* Failed to parse JSON, proceed with text parsing */
    }

    const title = parsedData?.title || generateProfessionalTitle(requestedContentType, websiteData)
    let summary = parsedData?.summary || ""
    let keyPoints = Array.isArray(parsedData?.keyPoints) ? parsedData.keyPoints : []
    let sections: ContentSection[] = Array.isArray(parsedData?.sections) ? parsedData.sections : []
    const mainContent = parsedData?.content || cleanResponse // Use parsed content or full response

    // If not parsed as JSON or sections are missing, try to derive from mainContent
    if (sections.length === 0) {
      sections = extractSectionsFromText(mainContent)
    }
    if (!summary && sections.length > 0) {
      summary = sections[0].content.substring(0, 250) + (sections[0].content.length > 250 ? "..." : "")
    }
    if (keyPoints.length === 0) {
      keyPoints = extractKeyPointsFromText(mainContent, 5)
    }

    // Ensure sections have reasonable content
    sections = sections.filter((sec) => sec.title.trim() && sec.content.trim())
    if (sections.length === 0) {
      // Still no sections, use a default
      sections = [{ title: "Generated Content", content: mainContent, level: 1 }]
    }

    const markdownOutput = sections
      .map((sec) => `${"#".repeat(sec.level)} ${sec.title}\n\n${sec.content.trim()}`)
      .join("\n\n")
    const plainTextOutput = sections.map((sec) => `${sec.title}\n${sec.content.trim()}`).join("\n\n")

    const wordCount = countWords(plainTextOutput)
    const readingTime = Math.ceil(wordCount / 200) // Avg 200 WPM

    return {
      id: Date.now().toString(), // Simple unique ID
      title,
      content: plainTextOutput,
      markdown: markdownOutput,
      summary: summary || plainTextOutput.substring(0, 150) + (plainTextOutput.length > 150 ? "..." : ""),
      keyPoints: keyPoints.length > 0 ? keyPoints : [plainTextOutput.substring(0, 100) + "..."],
      sections,
      wordCount,
      readingTime,
      contentType: requestedContentType,
      tone: requestedTone,
      createdAt: new Date().toISOString(),
      websiteUrl: websiteData?.url,
    }
  } catch (error) {
    console.error("Error in structureProfessionalContent:", error)
    return createFallbackContent(
      requestedContentType,
      requestedTone,
      error instanceof Error ? error.message : "Structuring error",
    )
  }
}

function generateProfessionalTitle(contentType: string, websiteData?: any): string {
  const websiteName = websiteData?.title || websiteData?.url || "Analysis"
  const typeLabel = contentType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  return `${typeLabel}: ${websiteName}`
}

function extractSectionsFromText(text: string): ContentSection[] {
  const sections: ContentSection[] = []
  const lines = text.split("\n")
  let currentContent: string[] = []
  let currentTitle = "Introduction" // Default first section title
  let currentLevel = 1

  for (const line of lines) {
    const trimmedLine = line.trim()
    const headerMatch = trimmedLine.match(/^(#+)\s+(.*)|(^\S.*:$)/) // Markdown headers or Title Case Line Ending with Colon

    if (headerMatch) {
      if (currentContent.length > 0 || sections.length > 0) {
        // Avoid empty first section if first line is header
        sections.push({ title: currentTitle, content: currentContent.join("\n").trim(), level: currentLevel })
      }
      currentContent = []
      if (headerMatch[1]) {
        // Markdown header
        currentLevel = headerMatch[1].length
        currentTitle = headerMatch[2]
      } else {
        // Title Case:
        currentLevel = 2 // Assume H2 for colon-terminated lines
        currentTitle = headerMatch[3].slice(0, -1)
      }
    } else if (trimmedLine) {
      currentContent.push(trimmedLine)
    } else if (currentContent.length > 0) {
      // Preserve paragraph breaks
      currentContent.push("")
    }
  }
  // Add the last section
  if (currentContent.length > 0 || !sections.find((s) => s.title === currentTitle)) {
    sections.push({ title: currentTitle, content: currentContent.join("\n").trim(), level: currentLevel })
  }
  return sections.filter((s) => s.content.trim() !== "")
}

function extractKeyPointsFromText(text: string, maxPoints = 5): string[] {
  const sentences = text
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 200)
  // Prioritize sentences with keywords or those appearing early
  const keywords = ["key", "important", "significant", "recommend", "conclusion", "summary", "finding"]
  const prioritized = sentences.sort((a, b) => {
    const aHasKeyword = keywords.some((k) => a.toLowerCase().includes(k))
    const bHasKeyword = keywords.some((k) => b.toLowerCase().includes(k))
    if (aHasKeyword && !bHasKeyword) return -1
    if (!aHasKeyword && bHasKeyword) return 1
    return 0 // Keep original order for sentences without keywords
  })
  return prioritized.slice(0, maxPoints)
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function createFallbackContent(contentType: string, tone: string, errorReason: string): StructuredContent {
  const title = `Content Generation Error for ${contentType}`
  const errorMessage = `Failed to generate content. Reason: ${errorReason}. Please try again or adjust your prompt.`
  return {
    id: Date.now().toString(),
    title,
    content: errorMessage,
    markdown: `# ${title}\n\n${errorMessage}`,
    summary: "Content generation failed.",
    keyPoints: [errorReason],
    sections: [{ title: "Error", content: errorMessage, level: 1 }],
    wordCount: countWords(errorMessage),
    readingTime: 1,
    contentType,
    tone,
    createdAt: new Date().toISOString(),
  }
}

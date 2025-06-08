import { NextResponse } from "next/server"

// Define types
interface GenerateContentRequest {
  prompt: string
  contentType: string
  structureTemplate?: string
  websiteUrl?: string
  websiteTitle?: string
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body: GenerateContentRequest = await request.json()
    const { prompt, contentType, structureTemplate, websiteUrl, websiteTitle } = body

    // Validate required fields
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Try to use AI SDK if available
    let content = ""
    let usedAI = false

    try {
      // Dynamic import to avoid build issues
      const { generateText } = await import("ai")
      const { groq } = await import("@ai-sdk/groq")

      // Check if we have the API key
      const apiKey = process.env.GROQ_API_KEY || process.env.XAI_API_KEY

      if (apiKey) {
        // Prepare context with website information
        const websiteContext =
          websiteUrl || websiteTitle
            ? `\nWebsite URL: ${websiteUrl || "Not provided"}\nWebsite Title: ${websiteTitle || "Not provided"}`
            : ""

        // Prepare structure template context
        const templateContext = structureTemplate ? `\nPlease follow this structure:\n${structureTemplate}` : ""

        // Build the full prompt
        const fullPrompt = `Generate ${contentType.replace("-", " ")} content based on the following prompt: "${prompt}"${websiteContext}${templateContext}`

        // Generate content using AI
        const result = await generateText({
          model: groq("llama3-70b-8192"),
          prompt: fullPrompt,
          maxTokens: 4000,
        })

        content = result.text
        usedAI = true
      }
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      // Continue with fallback content
    }

    // If AI failed or wasn't available, generate fallback content
    if (!content) {
      // Extract domain name for better fallback content
      const domainName = websiteUrl
        ? new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`).hostname.replace("www.", "")
        : "example.com"

      const siteName = websiteTitle || domainName

      // Generate a title based on the prompt
      const title = prompt.includes("?") ? prompt.split("?")[0] + "?" : `Content About ${siteName}`

      // Generate basic content based on structure template or default structure
      if (structureTemplate) {
        content = structureTemplate.replace("[TITLE]", title)
        content += `\n\nThis is generated content about ${siteName}. The website offers valuable services and information for users interested in this topic.`
      } else {
        content = `# ${title}\n\n## Introduction\n\n${siteName} provides a comprehensive solution for users looking for quality services. This content explores the key aspects and benefits.\n\n## Main Points\n\n- Feature 1: Description and benefits\n- Feature 2: How it helps users\n- Feature 3: What makes it unique\n\n## Conclusion\n\n${siteName} stands out as a leading option in this field, offering exceptional value and service to all users.`
      }
    }

    // Return the generated content
    return NextResponse.json({
      content,
      usedAI,
      websiteInfo: {
        url: websiteUrl,
        title: websiteTitle,
      },
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}

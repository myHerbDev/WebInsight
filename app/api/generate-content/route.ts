import { NextResponse } from "next/server"
import { supabaseAdmin, safeDbOperation } from "@/lib/supabase-db"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { websiteData, contentType, customPrompt, includeAnalytics } = await request.json()

    if (!contentType) {
      return NextResponse.json({ error: "Content type is required" }, { status: 400 })
    }

    console.log(`Generating ${contentType} content`)

    let analysis = null
    let analysisId = null

    // If websiteData is provided, use it directly
    if (websiteData) {
      analysis = websiteData
      analysisId = websiteData._id || websiteData.id
    }

    // Generate content using Groq AI or fallback
    let content = ""
    let markdown = ""
    let title = ""

    try {
      if (process.env.GROQ_API_KEY) {
        console.log("Using Groq AI for content generation")

        const prompt = createContentPrompt(analysis, contentType, customPrompt)
        console.log("Generated prompt length:", prompt.length)

        const { text } = await generateText({
          model: groq("llama3-70b-8192"),
          prompt,
          maxTokens: 3000,
          temperature: 0.7,
        })

        // Parse the response to extract content and markdown
        const parsedResponse = parseContentResponse(text, contentType)
        content = parsedResponse.content
        markdown = parsedResponse.markdown
        title = parsedResponse.title

        console.log("Successfully generated content with Groq AI")
      } else {
        console.log("Groq API key not available, using fallback content")
        const fallbackResponse = getFallbackContent(contentType, analysis, customPrompt)
        content = fallbackResponse.content
        markdown = fallbackResponse.markdown
        title = fallbackResponse.title
      }

      // Save the generated content to Supabase
      let contentId = null
      if (analysisId) {
        contentId = await safeDbOperation(
          async () => {
            const { data, error } = await supabaseAdmin
              .from("generated_content")
              .insert([
                {
                  analysis_id: analysisId,
                  content_type: contentType,
                  tone: "professional",
                  content: content,
                  markdown: markdown,
                  title: title,
                  created_at: new Date().toISOString(),
                },
              ])
              .select("id")
              .single()

            if (error) throw error
            return data.id
          },
          null,
          "Failed to save generated content",
        )
        console.log(`Saved generated content with ID: ${contentId}`)
      }

      return NextResponse.json({
        content,
        markdown,
        title,
        contentId,
        success: true,
        message: "Content generated successfully",
      })
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      // Fallback to predefined content
      console.log("Falling back to predefined content")
      const fallbackResponse = getFallbackContent(contentType, analysis, customPrompt)

      return NextResponse.json({
        content: fallbackResponse.content,
        markdown: fallbackResponse.markdown,
        title: fallbackResponse.title,
        contentId: null,
        success: true,
        message: "Content generated successfully (fallback)",
      })
    }
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json(
      {
        content: "# Error Generating Content\n\nThere was an error generating the requested content. Please try again.",
        error: "Failed to generate content",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

function createContentPrompt(analysis: any, contentType: string, customPrompt: string): string {
  const baseContext = analysis
    ? `
Website Analysis Data:
- Website: ${analysis.url || "Unknown"}
- Title: ${analysis.title || "Unknown"}
- Summary: ${analysis.summary || "No summary available"}
- Performance Score: ${analysis.sustainability_score || analysis.performance_score || 0}%
- Keywords: ${analysis.keywords?.join(", ") || "No keywords"}
`
    : ""

  const customContext = customPrompt ? `\nCustom Instructions: ${customPrompt}` : ""

  const contentTypeInstructions = {
    "blog-post": "Write a comprehensive blog post with engaging headlines, clear structure, and actionable insights.",
    "social-media": "Create engaging social media posts for different platforms (Twitter, LinkedIn, Facebook).",
    newsletter: "Write a professional newsletter with clear sections and call-to-action.",
    "press-release": "Create a formal press release with proper structure and professional tone.",
    "product-description": "Write compelling product descriptions that highlight benefits and features.",
    "meta-description": "Create SEO-optimized meta descriptions and title tags.",
  }

  return `${baseContext}${customContext}

Task: ${contentTypeInstructions[contentType as keyof typeof contentTypeInstructions] || "Generate relevant content"}

Please provide your response in the following JSON format:
{
  "title": "Content Title",
  "content": "Plain text content...",
  "markdown": "# Markdown formatted content..."
}

Make the content engaging, informative, and professionally written.`
}

function parseContentResponse(text: string, contentType: string): { content: string; markdown: string; title: string } {
  try {
    // Try to parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        content: parsed.content || text,
        markdown: parsed.markdown || text,
        title: parsed.title || `Generated ${contentType}`,
      }
    }
  } catch (error) {
    console.error("Error parsing content response:", error)
  }

  // Fallback to using the raw text
  return {
    content: text,
    markdown: text,
    title: `Generated ${contentType}`,
  }
}

function getFallbackContent(
  contentType: string,
  analysis: any,
  customPrompt: string,
): { content: string; markdown: string; title: string } {
  const websiteName = analysis?.title || analysis?.url || "the website"
  const websiteUrl = analysis?.url || "example.com"

  const fallbackContent = {
    "blog-post": {
      title: `Comprehensive Analysis of ${websiteName}`,
      content: `# Comprehensive Analysis of ${websiteName}

In today's digital landscape, understanding your website's performance is crucial for success. Our recent analysis of ${websiteName} reveals valuable insights that can help improve user experience and business outcomes.

## Key Findings

Our comprehensive analysis uncovered several important aspects of ${websiteName}:

- Performance optimization opportunities
- Security enhancements needed
- Content strategy improvements
- User experience recommendations

## Performance Insights

The website demonstrates ${analysis?.sustainability_score > 75 ? "strong" : "moderate"} performance with a sustainability score of ${analysis?.sustainability_score || 75}%. This indicates ${analysis?.sustainability_score > 75 ? "excellent optimization" : "room for improvement"} in areas such as loading speed, resource optimization, and overall efficiency.

## Recommendations

Based on our analysis, we recommend:

1. Optimize images and implement lazy loading
2. Minimize CSS and JavaScript files
3. Implement proper caching strategies
4. Enhance security measures
5. Improve content structure and SEO

## Conclusion

${websiteName} shows ${analysis?.sustainability_score > 75 ? "strong potential" : "significant opportunities"} for optimization. By implementing the recommended improvements, the website can achieve better performance, enhanced user experience, and improved search engine rankings.

${customPrompt ? `\n## Additional Considerations\n\n${customPrompt}` : ""}`,
      markdown: `# Comprehensive Analysis of ${websiteName}

In today's digital landscape, understanding your website's performance is crucial for success. Our recent analysis of **${websiteName}** reveals valuable insights that can help improve user experience and business outcomes.

## Key Findings

Our comprehensive analysis uncovered several important aspects of ${websiteName}:

- Performance optimization opportunities
- Security enhancements needed  
- Content strategy improvements
- User experience recommendations

## Performance Insights

The website demonstrates **${analysis?.sustainability_score > 75 ? "strong" : "moderate"}** performance with a sustainability score of **${analysis?.sustainability_score || 75}%**. This indicates ${analysis?.sustainability_score > 75 ? "excellent optimization" : "room for improvement"} in areas such as loading speed, resource optimization, and overall efficiency.

## Recommendations

Based on our analysis, we recommend:

1. **Optimize images** and implement lazy loading
2. **Minimize CSS and JavaScript** files
3. **Implement proper caching** strategies
4. **Enhance security measures**
5. **Improve content structure** and SEO

## Conclusion

${websiteName} shows **${analysis?.sustainability_score > 75 ? "strong potential" : "significant opportunities"}** for optimization. By implementing the recommended improvements, the website can achieve better performance, enhanced user experience, and improved search engine rankings.

${customPrompt ? `\n## Additional Considerations\n\n${customPrompt}` : ""}`,
    },
    "social-media": {
      title: `Social Media Content for ${websiteName}`,
      content: `🚀 Just analyzed ${websiteName} and the results are impressive!

📊 Performance Score: ${analysis?.sustainability_score || 75}%
🔍 Key insights discovered
💡 Optimization opportunities identified

#WebsiteAnalysis #PerformanceOptimization #DigitalMarketing

---

LinkedIn Post:
Excited to share insights from our latest website analysis of ${websiteName}. The comprehensive review revealed a ${analysis?.sustainability_score || 75}% performance score with several optimization opportunities. Key findings include performance enhancements, security improvements, and content strategy recommendations.

---

Facebook Post:
We've completed a thorough analysis of ${websiteName} and discovered some fascinating insights! With a performance score of ${analysis?.sustainability_score || 75}%, there are excellent opportunities for optimization and growth.

${customPrompt ? `\nCustom focus: ${customPrompt}` : ""}`,
      markdown: `## Social Media Content for ${websiteName}

### Twitter/X Post
🚀 Just analyzed **${websiteName}** and the results are impressive!

📊 Performance Score: **${analysis?.sustainability_score || 75}%**  
🔍 Key insights discovered  
💡 Optimization opportunities identified  

#WebsiteAnalysis #PerformanceOptimization #DigitalMarketing

---

### LinkedIn Post
Excited to share insights from our latest website analysis of **${websiteName}**. The comprehensive review revealed a **${analysis?.sustainability_score || 75}%** performance score with several optimization opportunities. Key findings include performance enhancements, security improvements, and content strategy recommendations.

---

### Facebook Post
We've completed a thorough analysis of **${websiteName}** and discovered some fascinating insights! With a performance score of **${analysis?.sustainability_score || 75}%**, there are excellent opportunities for optimization and growth.

${customPrompt ? `\n### Custom Focus\n${customPrompt}` : ""}`,
    },
  }

  const defaultContent = {
    title: `Generated Content for ${websiteName}`,
    content: `Generated content for ${websiteName} (${websiteUrl})

This content was generated based on the website analysis. The website shows a performance score of ${analysis?.sustainability_score || 75}% with various optimization opportunities.

${customPrompt || "No specific instructions provided."}`,
    markdown: `# Generated Content for ${websiteName}

Generated content for **${websiteName}** (${websiteUrl})

This content was generated based on the website analysis. The website shows a performance score of **${analysis?.sustainability_score || 75}%** with various optimization opportunities.

${customPrompt || "*No specific instructions provided.*"}`,
  }

  return fallbackContent[contentType as keyof typeof fallbackContent] || defaultContent
}

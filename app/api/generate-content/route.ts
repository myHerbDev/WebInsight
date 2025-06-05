import { NextResponse } from "next/server"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  try {
    // Enhanced request body parsing
    let requestBody
    try {
      const bodyText = await request.text()
      console.log("Content generation request body length:", bodyText.length)

      if (!bodyText || !bodyText.trim()) {
        return NextResponse.json({ error: "Request body is required" }, { status: 400 })
      }

      requestBody = JSON.parse(bodyText)
      console.log("Parsed request body:", JSON.stringify(requestBody, null, 2))

      // Validate required fields
      if (!requestBody.contentType) {
        return NextResponse.json(
          {
            error: "Missing required field: contentType",
          },
          { status: 400 },
        )
      }
    } catch (parseError: any) {
      console.error("JSON parsing error in content generation:", parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details: parseError.message,
        },
        { status: 400 },
      )
    }

    const { analysisId, contentType, tone = "professional", customPrompt, websiteData } = requestBody

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY not found in environment variables")
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 })
    }

    console.log(`Generating ${contentType} content with ${tone} tone for website:`, websiteData?.url || "custom prompt")

    // Enhanced AI content generation with validation
    let aiResponse
    try {
      const prompt = createContentPrompt(contentType, tone, customPrompt, websiteData)
      console.log("Generated prompt length:", prompt.length)

      const result = await generateText({
        model: groq("llama3-70b-8192"),
        prompt,
        maxTokens: 4000,
        temperature: 0.7,
      })

      aiResponse = result.text

      // Validate AI response
      if (!aiResponse || typeof aiResponse !== "string" || aiResponse.trim().length === 0) {
        throw new Error("Empty or invalid AI response")
      }

      console.log("AI content generated successfully, length:", aiResponse.length)
    } catch (aiError: any) {
      console.error("AI generation error:", aiError)
      return NextResponse.json(
        {
          error: "Failed to generate content",
          message: "AI service temporarily unavailable: " + aiError.message,
        },
        { status: 503 },
      )
    }

    // Parse and format the generated content
    const contentId = randomBytes(16).toString("hex")
    const generatedContent = {
      id: contentId,
      title: generateTitle(contentType, websiteData),
      content: aiResponse.trim(),
      markdown: formatAsMarkdown(aiResponse.trim(), contentType),
      contentType,
      tone,
      analysisId: analysisId || null,
      createdAt: new Date().toISOString(),
      websiteUrl: websiteData?.url || null,
    }

    // Save to Neon database (only if available and analysisId exists)
    let savedContent = generatedContent
    if (isNeonAvailable() && analysisId) {
      savedContent = await safeDbOperation(
        async () => {
          await sql`
            INSERT INTO generated_content (
              id, analysis_id, content_type, tone, content, markdown, created_at
            ) VALUES (
              ${contentId}, ${analysisId}, ${contentType}, ${tone}, 
              ${generatedContent.content}, ${generatedContent.markdown}, 
              ${generatedContent.createdAt}
            )
          `
          return generatedContent
        },
        generatedContent,
        "Error saving generated content to database",
      )
    }

    console.log("Content generation completed successfully")

    return NextResponse.json({
      success: true,
      content: savedContent,
    })
  } catch (error: any) {
    console.error("Content generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate content",
        message: error.message || "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

function generateTitle(contentType: string, websiteData?: any): string {
  const websiteName = websiteData?.title || websiteData?.url || "Website"
  const date = new Date().toLocaleDateString()

  const titles = {
    "sustainability-research": `Comprehensive Sustainability Research: ${websiteName}`,
    "scholar-document": `Academic Analysis of ${websiteName} - Sustainability Assessment`,
    "mind-map": `Sustainability Mind Map: ${websiteName}`,
    "executive-summary": `Executive Summary: Sustainability Analysis of ${websiteName}`,
    "technical-audit": `Technical Sustainability Audit: ${websiteName}`,
    "improvement-plan": `Sustainability Improvement Plan for ${websiteName}`,
    "carbon-footprint": `Carbon Footprint Analysis: ${websiteName}`,
    "green-hosting": `Green Hosting Assessment: ${websiteName}`,
    "performance-report": `Performance & Sustainability Report: ${websiteName}`,
    "compliance-check": `Environmental Compliance Check: ${websiteName}`,
    "blog-post": `Blog Post: ${websiteName} Analysis`,
    "social-media": `Social Media Content: ${websiteName}`,
    newsletter: `Newsletter: ${websiteName} Features`,
    "press-release": `Press Release: ${websiteName}`,
  }

  return titles[contentType as keyof typeof titles] || `${contentType} - ${websiteName} (${date})`
}

function createContentPrompt(contentType: string, tone: string, customPrompt?: string, websiteData?: any): string {
  const baseContext = websiteData
    ? `
WEBSITE ANALYSIS DATA:
URL: ${websiteData.url || "Unknown"}
Title: ${websiteData.title || "Unknown"}
Summary: ${websiteData.summary || "No summary available"}
Key Points: ${websiteData.keyPoints?.join(", ") || "None"}
Keywords: ${websiteData.keywords?.join(", ") || "None"}
Sustainability Score: ${websiteData.sustainability?.score || "Not available"}
Performance Score: ${websiteData.sustainability?.performance || "Not available"}
Script Optimization: ${websiteData.sustainability?.scriptOptimization || "Not available"}
Content Quality: ${websiteData.sustainability?.duplicateContent || "Not available"}
Improvements Needed: ${websiteData.sustainability?.improvements?.join(", ") || "None identified"}
Content Stats: ${JSON.stringify(websiteData.contentStats || {}, null, 2)}
`
    : "No website data provided. Use the custom prompt below."

  const contentPrompts = {
    "sustainability-research": `Create a comprehensive sustainability research document analyzing this website's environmental impact. Include:
    
1. EXECUTIVE SUMMARY
2. METHODOLOGY & SCOPE
3. CARBON FOOTPRINT ANALYSIS
   - Server energy consumption
   - Data transfer impact
   - User device energy usage
4. TECHNICAL SUSTAINABILITY METRICS
   - Code efficiency
   - Resource optimization
   - Caching strategies
5. GREEN HOSTING ASSESSMENT
   - Hosting provider sustainability
   - Renewable energy usage
   - Server location efficiency
6. PERFORMANCE IMPACT ON SUSTAINABILITY
   - Page load times
   - Resource compression
   - Image optimization
7. RECOMMENDATIONS & ACTION PLAN
8. BENCHMARKING AGAINST INDUSTRY STANDARDS
9. FUTURE SUSTAINABILITY ROADMAP
10. CONCLUSION & NEXT STEPS

Provide detailed analysis with specific metrics, actionable recommendations, and industry comparisons.`,

    "scholar-document": `Write an academic-style research document on the sustainability aspects of this website. Structure as:

ABSTRACT
1. INTRODUCTION
   - Background on web sustainability
   - Research objectives
   - Methodology
2. LITERATURE REVIEW
   - Current state of web sustainability research
   - Industry standards and frameworks
3. ANALYSIS
   - Technical architecture assessment
   - Environmental impact evaluation
   - Performance metrics analysis
4. FINDINGS
   - Key sustainability indicators
   - Comparative analysis
   - Statistical significance
5. DISCUSSION
   - Implications for web development
   - Industry best practices
   - Limitations of current approach
6. RECOMMENDATIONS
   - Technical improvements
   - Strategic initiatives
   - Implementation timeline
7. CONCLUSION
8. REFERENCES

Use academic language, cite relevant frameworks (like Website Carbon Calculator, Green Web Foundation), and include quantitative analysis.`,

    "mind-map": `Create a comprehensive mind map structure for website sustainability analysis. Format as a hierarchical text structure:

🌍 WEBSITE SUSTAINABILITY ANALYSIS
├── 🔋 ENERGY EFFICIENCY
│   ├── Server Performance
│   │   ├── CPU Usage Optimization
│   │   ├── Memory Management
│   │   └── Database Efficiency
│   ├── Code Optimization
│   │   ├── JavaScript Minification
│   │   ├── CSS Optimization
│   │   └── HTML Structure
│   └── Resource Loading
│       ├── Lazy Loading
│       ├── Caching Strategies
│       └── CDN Usage
├── 🌱 CARBON FOOTPRINT
│   ├── Data Transfer
│   │   ├── Page Size Analysis
│   │   ├── Image Compression
│   │   └── Video Optimization
│   ├── User Behavior Impact
│   │   ├── Session Duration
│   │   ├── Page Views
│   │   └── Return Visits
│   └── Device Energy Consumption
├── 🏢 GREEN HOSTING
│   ├── Renewable Energy Usage
│   ├── Server Location
│   ├── Hosting Provider Policies
│   └── Infrastructure Efficiency
├── 📊 PERFORMANCE METRICS
│   ├── Core Web Vitals
│   ├── Loading Speed
│   ├── Accessibility Score
│   └── SEO Performance
└── 🎯 IMPROVEMENT OPPORTUNITIES
    ├── Quick Wins
    ├── Medium-term Goals
    └── Long-term Strategy

Expand each branch with specific findings and recommendations for this website.`,

    "executive-summary": `Create a concise executive summary for stakeholders focusing on:

EXECUTIVE SUMMARY: WEBSITE SUSTAINABILITY ASSESSMENT

KEY FINDINGS:
• Overall sustainability score and ranking
• Primary environmental impact factors
• Critical performance issues
• Competitive positioning

BUSINESS IMPACT:
• Cost implications of current setup
• Brand reputation considerations
• Regulatory compliance status
• Market differentiation opportunities

PRIORITY RECOMMENDATIONS:
• Top 3 immediate actions (0-30 days)
• Medium-term improvements (1-6 months)
• Strategic initiatives (6-12 months)

INVESTMENT REQUIRED:
• Technical resources needed
• Estimated implementation costs
• Expected ROI and benefits
• Risk assessment

NEXT STEPS:
• Implementation roadmap
• Success metrics
• Monitoring strategy
• Stakeholder responsibilities`,

    "technical-audit": `Conduct a detailed technical audit focusing on sustainability aspects:

TECHNICAL SUSTAINABILITY AUDIT REPORT

1. INFRASTRUCTURE ANALYSIS
   - Server architecture review
   - Hosting environment assessment
   - CDN configuration analysis
   - Database optimization review

2. CODE EFFICIENCY EVALUATION
   - JavaScript performance analysis
   - CSS optimization assessment
   - HTML structure review
   - Third-party script audit

3. RESOURCE OPTIMIZATION
   - Image compression analysis
   - Font loading optimization
   - Asset bundling review
   - Caching strategy assessment

4. PERFORMANCE METRICS
   - Core Web Vitals analysis
   - Loading speed breakdown
   - Resource waterfall analysis
   - Mobile performance review

5. SUSTAINABILITY SCORING
   - Carbon footprint calculation
   - Energy efficiency rating
   - Green hosting verification
   - Industry benchmark comparison

6. TECHNICAL RECOMMENDATIONS
   - Priority fixes with impact assessment
   - Implementation complexity rating
   - Resource requirements
   - Timeline estimates`,

    "improvement-plan": `Develop a comprehensive sustainability improvement plan:

SUSTAINABILITY IMPROVEMENT PLAN

CURRENT STATE ASSESSMENT:
• Baseline sustainability metrics
• Performance benchmarks
• Environmental impact analysis
• Competitive positioning

IMPROVEMENT ROADMAP:

PHASE 1: QUICK WINS (0-30 days)
• Image optimization
• Code minification
• Caching improvements
• Estimated impact: X% reduction in carbon footprint

PHASE 2: INFRASTRUCTURE OPTIMIZATION (1-3 months)
• Green hosting migration
• CDN optimization
• Database tuning
• Estimated impact: X% improvement in efficiency

PHASE 3: ADVANCED OPTIMIZATION (3-6 months)
• Progressive web app features
• Advanced caching strategies
• Third-party script optimization
• Estimated impact: X% overall improvement

PHASE 4: MONITORING & CONTINUOUS IMPROVEMENT (Ongoing)
• Sustainability monitoring setup
• Regular performance audits
• Continuous optimization
• Long-term sustainability goals

IMPLEMENTATION DETAILS:
• Resource allocation
• Budget requirements
• Success metrics
• Risk mitigation strategies`,

    "carbon-footprint": `Analyze the carbon footprint of this website:

CARBON FOOTPRINT ANALYSIS REPORT

METHODOLOGY:
• Calculation framework used
• Data sources and assumptions
• Measurement scope and boundaries

CARBON EMISSIONS BREAKDOWN:
1. DATA TRANSFER EMISSIONS
   - Page weight analysis
   - Annual visitor estimates
   - Data transfer carbon intensity

2. SERVER ENERGY CONSUMPTION
   - Hosting infrastructure assessment
   - Energy source analysis
   - Server efficiency metrics

3. USER DEVICE IMPACT
   - Device energy consumption
   - Usage pattern analysis
   - Browser efficiency factors

4. TOTAL CARBON FOOTPRINT
   - Annual CO2 equivalent emissions
   - Per-visit carbon cost
   - Industry comparison

REDUCTION OPPORTUNITIES:
• High-impact optimization areas
• Potential emission reductions
• Implementation priorities
• Cost-benefit analysis

CARBON OFFSET RECOMMENDATIONS:
• Offset program suggestions
• Verification standards
• Cost estimates
• Implementation strategy`,

    "green-hosting": `Assess the green hosting aspects of this website:

GREEN HOSTING ASSESSMENT

CURRENT HOSTING ANALYSIS:
• Hosting provider identification
• Data center locations
• Energy sources used
• Sustainability certifications

RENEWABLE ENERGY USAGE:
• Percentage of renewable energy
• Green energy certificates
• Carbon offset programs
• Sustainability commitments

INFRASTRUCTURE EFFICIENCY:
• Power Usage Effectiveness (PUE)
• Server utilization rates
• Cooling efficiency
• Hardware lifecycle management

GREEN HOSTING RECOMMENDATIONS:
• Certified green hosting providers
• Migration considerations
• Cost implications
• Performance impact assessment

SUSTAINABILITY CERTIFICATIONS:
• Available certifications
• Verification processes
• Marketing benefits
• Compliance requirements`,

    "performance-report": `Generate a comprehensive performance and sustainability report:

PERFORMANCE & SUSTAINABILITY REPORT

EXECUTIVE DASHBOARD:
• Overall sustainability score
• Performance grade
• Carbon footprint rating
• Improvement potential

DETAILED METRICS:
1. CORE WEB VITALS
   - Largest Contentful Paint
   - First Input Delay
   - Cumulative Layout Shift

2. SUSTAINABILITY INDICATORS
   - Page weight efficiency
   - Energy consumption per visit
   - Carbon emissions per user

3. TECHNICAL PERFORMANCE
   - Server response times
   - Resource loading efficiency
   - Caching effectiveness

COMPARATIVE ANALYSIS:
• Industry benchmarks
• Competitor comparison
• Best-in-class examples
• Improvement opportunities

ACTIONABLE INSIGHTS:
• Priority optimization areas
• Expected impact of improvements
• Implementation complexity
• Resource requirements`,

    "compliance-check": `Perform an environmental compliance assessment:

ENVIRONMENTAL COMPLIANCE ASSESSMENT

REGULATORY FRAMEWORK REVIEW:
• Applicable environmental regulations
• Industry-specific requirements
• Regional compliance obligations
• Emerging legislation impact

CURRENT COMPLIANCE STATUS:
• Environmental reporting requirements
• Carbon disclosure obligations
• Sustainability standard adherence
• Certification compliance

GAP ANALYSIS:
• Non-compliance areas identified
• Risk assessment
• Remediation requirements
• Timeline for compliance

COMPLIANCE ROADMAP:
• Immediate compliance actions
• Medium-term compliance strategy
• Long-term sustainability goals
• Monitoring and reporting framework

RISK MITIGATION:
• Compliance risk assessment
• Mitigation strategies
• Contingency planning
• Stakeholder communication`,

    // Existing content types
    "blog-post": `Write a comprehensive blog post about this website's sustainability features and analysis.`,
    "social-media": `Create engaging social media posts highlighting the sustainability aspects of this website.`,
    newsletter: `Write a newsletter section featuring this website's sustainability initiatives.`,
    "press-release": `Create a professional press release about this website's sustainability achievements.`,
  }

  const toneInstructions = {
    professional: "Use a professional, business-appropriate tone with industry terminology.",
    casual: "Write in a conversational, friendly tone that's easy to understand.",
    technical: "Use technical language and detailed explanations suitable for experts.",
    academic: "Use formal academic language with proper citations and scholarly approach.",
    creative: "Be creative and engaging with vivid descriptions and storytelling elements.",
    persuasive: "Focus on convincing the reader of the website's value and benefits.",
    informative: "Provide clear, factual information in an educational manner.",
  }

  const finalPrompt = `${baseContext}

CONTENT TYPE: ${contentType.toUpperCase()}

${customPrompt || contentPrompts[contentType as keyof typeof contentPrompts] || contentPrompts["sustainability-research"]}

TONE: ${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.professional}

REQUIREMENTS:
- Provide detailed, actionable insights
- Include specific metrics and data points where available
- Use the website analysis data provided above
- Structure the content clearly with headings and sections
- Include practical recommendations
- Make it comprehensive and valuable for sustainability professionals

Please provide well-structured, high-quality content that is engaging and valuable to the reader.`

  return finalPrompt
}

function formatAsMarkdown(content: string, contentType: string): string {
  const lines = content.split("\n")
  let markdown = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      markdown += "\n"
      continue
    }

    // Enhanced markdown formatting for sustainability content
    if (line.match(/^(EXECUTIVE SUMMARY|METHODOLOGY|ANALYSIS|FINDINGS|RECOMMENDATIONS|CONCLUSION)/i)) {
      markdown += `# ${line}\n\n`
    } else if (line.match(/^(Introduction|Background|Assessment|Review|Strategy|Implementation)/i)) {
      markdown += `## ${line}\n\n`
    } else if (line.match(/^\d+\.\s/)) {
      markdown += `### ${line}\n\n`
    } else if (line.match(/^[-•]\s/)) {
      markdown += `${line}\n`
    } else if (line.match(/^[A-Z\s]+:$/)) {
      markdown += `**${line}**\n\n`
    } else {
      markdown += `${line}\n\n`
    }
  }

  return markdown.trim()
}

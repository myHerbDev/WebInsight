import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { websiteData, analysisResults } = await request.json()

    if (!websiteData || !analysisResults) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const prompt = `
    As an expert web sustainability and performance consultant, analyze the following website data and provide personalized, actionable recommendations:

    Website: ${analysisResults.url}
    Sustainability Score: ${analysisResults.sustainabilityScore}%
    Performance Score: ${analysisResults.performanceScore}%
    Security Score: ${analysisResults.securityScore}%
    
    Current Issues: ${analysisResults.improvements?.join(", ") || "None specified"}
    
    Please provide:
    1. 5-7 specific, prioritized recommendations
    2. Detailed implementation steps for each
    3. Expected impact and effort level
    4. Personalized insights based on the website's current state
    5. Long-term sustainability roadmap

    Format the response as a JSON object with:
    - recommendations: array of recommendation objects
    - insights: array of key insights
    - roadmap: 3-phase implementation plan
    `

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert web sustainability and performance consultant. Provide detailed, actionable recommendations in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error("No response from AI")
    }

    // Parse the AI response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      parsedResponse = {
        recommendations: [
          {
            title: "Optimize Website Performance",
            description:
              "Based on your current performance score, focus on improving loading times and user experience.",
            priority: "high",
            impact: "high",
            effort: "medium",
            steps: ["Enable compression", "Optimize images", "Minimize HTTP requests"],
          },
          {
            title: "Enhance Sustainability",
            description: "Improve your environmental impact by optimizing resource usage and choosing green hosting.",
            priority: "high",
            impact: "medium",
            effort: "low",
            steps: ["Switch to green hosting", "Reduce third-party scripts", "Implement caching"],
          },
        ],
        insights: [
          "Your website shows potential for significant sustainability improvements",
          "Performance optimizations will have the highest immediate impact",
          "Security enhancements should be prioritized for user trust",
        ],
        roadmap: {
          phase1: "Immediate optimizations (1-2 weeks)",
          phase2: "Infrastructure improvements (1-2 months)",
          phase3: "Long-term sustainability goals (3+ months)",
        },
      }
    }

    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("Error generating AI recommendations:", error)
    return NextResponse.json({ error: "Failed to generate AI recommendations" }, { status: 500 })
  }
}

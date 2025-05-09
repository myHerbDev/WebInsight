import { groq } from "@ai-sdk/groq"

// Check if Groq API key exists
export const hasGroqApiKey = !!process.env.GROQ_API_KEY

// Export the groq model for use in the app
export const groqModel = groq("llama3-70b-8192")

// Helper function to generate text with Groq
export async function generateWithGroq(prompt: string, maxTokens = 1000) {
  if (!hasGroqApiKey) {
    throw new Error("Groq API key is not configured")
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that specializes in website analysis and content creation.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error generating with Groq:", error)
    throw error
  }
}

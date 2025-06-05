import { NextResponse } from "next/server"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let userId = searchParams.get("userId")

    // Try to get user from session if no userId provided
    if (!userId) {
      const sessionId = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0]
      if (sessionId) {
        const session = await getSession(sessionId)
        if (session) {
          userId = session.userId
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!isNeonAvailable()) {
      return NextResponse.json({
        savedAnalyses: [],
        favorites: [],
        message: "Database not available",
      })
    }

    const result = await safeDbOperation(
      async () => {
        // Get saved analyses
        const savedAnalyses = await sql`
          SELECT * FROM saved_analyses 
          WHERE user_id = ${userId} 
          ORDER BY created_at DESC
        `

        // Get favorites
        const favorites = await sql`
          SELECT * FROM favorites 
          WHERE user_id = ${userId} 
          ORDER BY created_at DESC
        `

        return {
          savedAnalyses: savedAnalyses || [],
          favorites: favorites || [],
        }
      },
      {
        savedAnalyses: [],
        favorites: [],
        message: "Error fetching data",
      },
      "Error fetching user data",
    )

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}

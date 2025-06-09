import { NextResponse } from "next/server"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"
import { getSession } from "@/lib/auth"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  try {
    let requestBody
    try {
      const bodyText = await request.text()
      if (!bodyText.trim()) {
        return NextResponse.json({ error: "Empty request body" }, { status: 400 })
      }
      requestBody = JSON.parse(bodyText)
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { userId, analysisId, type } = requestBody

    if (!analysisId || !type) {
      return NextResponse.json({ error: "Analysis ID and type are required" }, { status: 400 })
    }

    // Get user from session if no userId provided
    let userIdToUse = userId
    if (!userIdToUse) {
      const sessionId = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0]
      if (sessionId) {
        const session = await getSession(sessionId)
        if (session) {
          userIdToUse = session.userId
        }
      }
    }

    // If still no user, create a temporary user ID
    if (!userIdToUse) {
      userIdToUse = "temp-user-" + randomBytes(8).toString("hex")
    }

    if (!isNeonAvailable()) {
      return NextResponse.json({
        success: true,
        message: type === "favorite" ? "Added to favorites" : "Analysis saved",
        userId: userIdToUse,
      })
    }

    // Determine the table based on type
    const tableName = type === "favorite" ? "favorites" : "saved_analyses"

    const result = await safeDbOperation(
      async () => {
        // Check if already exists
        const existing = await sql`
          SELECT id FROM ${sql(tableName)} 
          WHERE user_id = ${userIdToUse} AND analysis_id = ${analysisId}
        `

        if (existing.length > 0) {
          return {
            success: true,
            message: "Already saved",
            userId: userIdToUse,
          }
        }

        // Save new entry
        const entryId = randomBytes(16).toString("hex")
        await sql`
          INSERT INTO ${sql(tableName)} (id, user_id, analysis_id, created_at)
          VALUES (${entryId}, ${userIdToUse}, ${analysisId}, NOW())
        `

        return {
          success: true,
          message: type === "favorite" ? "Added to favorites" : "Analysis saved",
          userId: userIdToUse,
        }
      },
      {
        success: true,
        message: type === "favorite" ? "Added to favorites (fallback)" : "Analysis saved (fallback)",
        userId: userIdToUse,
      },
      "Error saving analysis",
    )

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error saving analysis:", error)
    return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
  }
}

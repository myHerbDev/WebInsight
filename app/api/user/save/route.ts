import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { userId, analysisId, type } = await request.json()

    if (!analysisId || !type) {
      return NextResponse.json({ error: "Analysis ID and type are required" }, { status: 400 })
    }

    // For preview mode or when MongoDB is not available, use mock data
    if (!process.env.MONGODB_URI) {
      const mockUserId = userId || "temp-user-123"
      return NextResponse.json({
        success: true,
        message: type === "favorite" ? "Added to favorites" : "Analysis saved",
        userId: mockUserId,
      })
    }

    // Real implementation with MongoDB
    try {
      const client = await clientPromise
      const db = client.db("website-analyzer")

      // If no userId, create a temporary user
      let userIdToUse = userId

      if (!userIdToUse) {
        const tempUser = await db.collection("users").insertOne({
          email: null,
          isTemporary: true,
          createdAt: new Date(),
        })
        userIdToUse = tempUser.insertedId.toString()
      }

      // Save the analysis based on type (save or favorite)
      const collection = type === "favorite" ? "favorites" : "saved-analyses"

      // Check if already exists - use string comparison instead of ObjectId
      const existing = await db.collection(collection).findOne({
        userId: userIdToUse,
        analysisId: analysisId,
      })

      if (existing) {
        // If already exists, return success
        return NextResponse.json({
          success: true,
          message: "Already saved",
          userId: userIdToUse,
        })
      }

      // Save new entry
      await db.collection(collection).insertOne({
        userId: userIdToUse,
        analysisId: analysisId,
        createdAt: new Date(),
      })

      return NextResponse.json({
        success: true,
        message: type === "favorite" ? "Added to favorites" : "Analysis saved",
        userId: userIdToUse,
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Fall back to mock data if database operations fail
      const mockUserId = userId || "temp-user-123"
      return NextResponse.json({
        success: true,
        message: type === "favorite" ? "Added to favorites (fallback)" : "Analysis saved (fallback)",
        userId: mockUserId,
      })
    }
  } catch (error) {
    console.error("Error saving analysis:", error)
    return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
  }
}

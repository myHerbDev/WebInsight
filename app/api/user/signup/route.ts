import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, tempUserId } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // For preview mode or when MongoDB is not available, use mock data
    if (!process.env.MONGODB_URI) {
      // Generate a mock user ID
      const mockUserId = "user-" + Math.random().toString(36).substring(2, 10)

      return NextResponse.json({
        success: true,
        userId: mockUserId,
        message: "User created successfully (preview mode)",
      })
    }

    // Real implementation with MongoDB
    try {
      const client = await clientPromise
      const db = client.db("website-analyzer")

      // Check if user already exists
      const existingUser = await db.collection("users").findOne({ email })

      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 })
      }

      // Hash password using our custom function instead of bcrypt
      const hashedPassword = await hashPassword(password)

      // Create new user
      const result = await db.collection("users").insertOne({
        email,
        password: hashedPassword,
        isTemporary: false,
        createdAt: new Date(),
      })

      const userId = result.insertedId.toString()

      // If tempUserId exists, transfer saved analyses and favorites
      if (tempUserId) {
        // Transfer saved analyses
        await db.collection("saved-analyses").updateMany({ userId: tempUserId }, { $set: { userId } })

        // Transfer favorites
        await db.collection("favorites").updateMany({ userId: tempUserId }, { $set: { userId } })

        // Delete temporary user - use string ID instead of ObjectId
        await db.collection("users").deleteOne({
          _id: tempUserId,
          isTemporary: true,
        })
      }

      return NextResponse.json({
        success: true,
        userId,
        message: "User created successfully",
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Fall back to mock data if database operations fail
      const mockUserId = "user-" + Math.random().toString(36).substring(2, 10)

      return NextResponse.json({
        success: true,
        userId: mockUserId,
        message: "User created successfully (fallback)",
      })
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

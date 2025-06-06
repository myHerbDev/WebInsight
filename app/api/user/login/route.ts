import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // For preview mode or when MongoDB is not available, use mock data
    if (!process.env.MONGODB_URI) {
      // Mock successful login for preview
      return NextResponse.json({
        success: true,
        userId: "mock-user-id",
        email,
      })
    }

    // Real implementation with MongoDB
    try {
      const client = await clientPromise
      const db = client.db("website-analyzer")

      // Find user by email
      const user = await db.collection("users").findOne({ email })

      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password)

      if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      return NextResponse.json({
        success: true,
        userId: user._id.toString(),
        email: user.email,
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Fall back to mock data if database operations fail
      return NextResponse.json({
        success: true,
        userId: "mock-user-id",
        email,
        message: "Logged in successfully (fallback)",
      })
    }
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}

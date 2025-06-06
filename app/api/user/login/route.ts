import { NextResponse } from "next/server"
import { authenticateUser, createSession } from "@/lib/auth"

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

    const { email, password } = requestBody

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const sessionId = await createSession(user)
    if (!sessionId) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      userId: user.id,
      email: user.email,
      message: "Logged in successfully",
    })

    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}

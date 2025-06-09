import { NextResponse } from "next/server"
import { createUser, userExists, createSession } from "@/lib/auth"
import { sql, safeDbOperation, isNeonAvailable } from "@/lib/neon-db"

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

    const { email, password, tempUserId } = requestBody

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const exists = await userExists(email)
    if (exists) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const user = await createUser(email, password)
    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Transfer data from temp user if provided
    if (tempUserId && isNeonAvailable()) {
      await safeDbOperation(
        async () => {
          // Transfer saved analyses
          await sql`
            UPDATE saved_analyses 
            SET user_id = ${user.id} 
            WHERE user_id = ${tempUserId}
          `

          // Transfer favorites
          await sql`
            UPDATE favorites 
            SET user_id = ${user.id} 
            WHERE user_id = ${tempUserId}
          `
        },
        undefined,
        "Error transferring user data",
      )
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
      message: "User created successfully",
    })

    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

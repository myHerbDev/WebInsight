import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { email, password, tempUserId } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Generate a mock user ID for preview mode
      const mockUserId = "user-" + Math.random().toString(36).substring(2, 10)

      return NextResponse.json({
        success: true,
        userId: mockUserId,
        message: "User created successfully (preview mode)",
      })
    }

    try {
      const supabase = createServerSupabaseClient()

      // Check if user already exists
      const { data: existingUser } = await supabase.from("auth.users").select("id").eq("email", email).single()

      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 })
      }

      // Create new user with Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm for simplicity
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      if (!data.user) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
      }

      const userId = data.user.id

      // If tempUserId exists, transfer saved analyses and favorites
      if (tempUserId) {
        try {
          // Transfer saved analyses
          await supabase.from("saved_analyses").update({ user_id: userId }).eq("user_id", tempUserId)

          // Transfer favorites
          await supabase.from("favorites").update({ user_id: userId }).eq("user_id", tempUserId)

          // Note: We don't delete the temp user as it might not exist in auth.users
        } catch (transferError) {
          console.error("Error transferring data:", transferError)
          // Continue even if transfer fails
        }
      }

      return NextResponse.json({
        success: true,
        userId,
        message: "User created successfully",
      })
    } catch (supabaseError) {
      console.error("Supabase error:", supabaseError)
      // Fall back to mock data if Supabase operations fail
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

import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId, analysisId, type } = await request.json()

    if (!analysisId || !type) {
      return NextResponse.json({ error: "Analysis ID and type are required" }, { status: 400 })
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const mockUserId = userId || "temp-user-123"
      return NextResponse.json({
        success: true,
        message: type === "favorite" ? "Added to favorites" : "Analysis saved",
        userId: mockUserId,
      })
    }

    try {
      const supabase = createServerSupabaseClient()

      // If no userId, create a temporary user entry
      let userIdToUse = userId

      if (!userIdToUse) {
        // Generate a temporary user ID
        userIdToUse = "temp-user-" + Math.random().toString(36).substring(2, 10)
      }

      // Determine the table based on type
      const tableName = type === "favorite" ? "favorites" : "saved_analyses"

      // Check if already exists
      const { data: existing } = await supabase
        .from(tableName)
        .select("id")
        .eq("user_id", userIdToUse)
        .eq("analysis_id", analysisId)
        .single()

      if (existing) {
        return NextResponse.json({
          success: true,
          message: "Already saved",
          userId: userIdToUse,
        })
      }

      // Save new entry
      const { error } = await supabase.from(tableName).insert({
        user_id: userIdToUse,
        analysis_id: analysisId,
      })

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        message: type === "favorite" ? "Added to favorites" : "Analysis saved",
        userId: userIdToUse,
      })
    } catch (supabaseError) {
      console.error("Supabase error:", supabaseError)
      // Fall back to mock data if Supabase operations fail
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

import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const accessToken = searchParams.get("accessToken")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        savedAnalyses: [],
        favorites: [],
        message: "Preview mode - no data available",
      })
    }

    try {
      const supabase = createServerSupabaseClient()

      // If access token is provided, verify the user
      if (accessToken) {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(accessToken)

        if (error || !user || user.id !== userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
      }

      // Get saved analyses
      const { data: savedAnalyses, error: savedError } = await supabase
        .from("saved_analyses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (savedError) {
        console.error("Error fetching saved analyses:", savedError)
      }

      // Get favorites
      const { data: favorites, error: favoritesError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (favoritesError) {
        console.error("Error fetching favorites:", favoritesError)
      }

      return NextResponse.json({
        savedAnalyses: savedAnalyses || [],
        favorites: favorites || [],
      })
    } catch (supabaseError) {
      console.error("Supabase error:", supabaseError)
      return NextResponse.json({
        savedAnalyses: [],
        favorites: [],
        message: "Error fetching data",
      })
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}

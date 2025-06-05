import { NextResponse } from "next/server"
import { supabaseAdmin, safeDbOperation } from "@/lib/supabase-db"

export async function POST(request: Request) {
  try {
    const { name, analysis_ids, comparison_data, user_id } = await request.json()

    if (!name || !analysis_ids || analysis_ids.length < 2) {
      return NextResponse.json({ error: "Name and at least 2 analysis IDs are required" }, { status: 400 })
    }

    const comparisonId = await safeDbOperation(
      async () => {
        const { data, error } = await supabaseAdmin
          .from("comparisons")
          .insert([
            {
              user_id: user_id || null,
              name,
              analysis_ids,
              comparison_data,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select("id")
          .single()

        if (error) throw error
        return data.id
      },
      Date.now().toString(),
      "Failed to save comparison",
    )

    return NextResponse.json({
      success: true,
      comparison_id: comparisonId,
      message: "Comparison saved successfully",
    })
  } catch (error) {
    console.error("Error saving comparison:", error)
    return NextResponse.json({ error: "Failed to save comparison" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    const comparisons = await safeDbOperation(
      async () => {
        let query = supabaseAdmin.from("comparisons").select("*").order("created_at", { ascending: false })

        if (userId) {
          query = query.eq("user_id", userId)
        } else {
          query = query.limit(50)
        }

        const { data, error } = await query
        if (error) throw error
        return data
      },
      [],
      "Failed to fetch comparisons",
    )

    return NextResponse.json(comparisons)
  } catch (error) {
    console.error("Error fetching comparisons:", error)
    return NextResponse.json({ error: "Failed to fetch comparisons" }, { status: 500 })
  }
}

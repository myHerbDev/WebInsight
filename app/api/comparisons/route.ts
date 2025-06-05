import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { name, analysis_ids, comparison_data, user_id } = await request.json()

    if (!name || !analysis_ids || analysis_ids.length < 2) {
      return NextResponse.json({ error: "Name and at least 2 analysis IDs are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO website_analyzer.comparisons 
      (user_id, name, analysis_ids, comparison_data, created_at, updated_at)
      VALUES (
        ${user_id || null}, ${name}, ${JSON.stringify(analysis_ids)}, 
        ${JSON.stringify(comparison_data)}, NOW(), NOW()
      )
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      comparison_id: result[0].id,
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

    let comparisons
    if (userId) {
      comparisons = await sql`
        SELECT * FROM website_analyzer.comparisons 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `
    } else {
      comparisons = await sql`
        SELECT * FROM website_analyzer.comparisons 
        ORDER BY created_at DESC
        LIMIT 50
      `
    }

    return NextResponse.json(comparisons)
  } catch (error) {
    console.error("Error fetching comparisons:", error)
    return NextResponse.json({ error: "Failed to fetch comparisons" }, { status: 500 })
  }
}

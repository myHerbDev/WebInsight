import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
// import { getAuth } from "@clerk/nextjs/server"; // Example if using Clerk for auth

const sql = neon(process.env.DATABASE_URL!)

// GET feedback for a specific provider
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const providerId = Number.parseInt(params.id, 10)
    if (isNaN(providerId)) {
      return NextResponse.json({ error: "Invalid provider ID" }, { status: 400 })
    }

    // Add pagination later if needed
    const feedbackResult = await sql`
      SELECT id, user_id, rating, comment, created_at
      FROM website_analyzer.hosting_feedback
      WHERE provider_id = ${providerId}
      ORDER BY created_at DESC
      LIMIT 20 
    `
    // Add user details (e.g., name, avatar) if you have a users table and join
    return NextResponse.json(feedbackResult)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}

// POST new feedback for a specific provider
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // const { userId } = getAuth(request); // Example: Get user from auth
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    // For now, let's assume userId might come from client or be null
    const tempUserId = "temp-user-id-for-dev" // Replace with actual auth

    const providerId = Number.parseInt(params.id, 10)
    if (isNaN(providerId)) {
      return NextResponse.json({ error: "Invalid provider ID" }, { status: 400 })
    }

    const { rating, comment, userId = tempUserId } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }
    if (comment && typeof comment !== "string") {
      return NextResponse.json({ error: "Invalid comment format" }, { status: 400 })
    }
    if (comment && comment.length > 1000) {
      return NextResponse.json({ error: "Comment cannot exceed 1000 characters" }, { status: 400 })
    }

    const newFeedback = await sql`
      INSERT INTO website_analyzer.hosting_feedback (provider_id, user_id, rating, comment)
      VALUES (${providerId}, ${userId}, ${rating}, ${comment})
      RETURNING id, user_id, rating, comment, created_at
    `

    // Optional: Trigger an update for average_rating on hosting_providers table here

    return NextResponse.json(newFeedback[0], { status: 201 })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    // Check for specific database errors, e.g., foreign key violation if provider_id is invalid
    if (error instanceof Error && error.message.includes("violates foreign key constraint")) {
      return NextResponse.json({ error: "Invalid provider ID or user ID." }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}

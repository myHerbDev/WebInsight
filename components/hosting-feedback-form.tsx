"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface HostingFeedbackFormProps {
  providerId: number
  onFeedbackSubmitted: (newFeedback: any) => void // Adjust 'any' to your feedback type
}

export function HostingFeedbackForm({ providerId, onFeedbackSubmitted }: HostingFeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast({ title: "Error", description: "Please select a rating.", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/hosting-providers/${providerId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }), // Add userId if implementing auth
      })
      const newFeedback = await response.json()
      if (!response.ok) {
        throw new Error(newFeedback.error || "Failed to submit feedback")
      }
      toast({ title: "Feedback Submitted!", description: "Thank you for your feedback." })
      onFeedbackSubmitted(newFeedback)
      setRating(0)
      setComment("")
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg bg-card">
      <h3 className="text-xl font-semibold">Leave a Review</h3>
      <div>
        <Label htmlFor="rating" className="mb-2 block font-medium">
          Your Rating
        </Label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-7 w-7 cursor-pointer transition-colors",
                (hoverRating || rating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 dark:text-gray-600",
              )}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="comment" className="mb-2 block font-medium">
          Your Review (Optional)
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this hosting provider..."
          rows={4}
          className="text-base"
        />
      </div>
      <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full sm:w-auto">
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}

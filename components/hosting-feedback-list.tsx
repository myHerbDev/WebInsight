"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export interface FeedbackItem {
  id: number
  user_id: string | null // Or a user object if joined
  rating: number
  comment: string | null
  created_at: string
  // Optional: user_name, user_avatar_url if you join with a users table
}

interface HostingFeedbackListProps {
  feedbackItems: FeedbackItem[]
}

export function HostingFeedbackList({ feedbackItems }: HostingFeedbackListProps) {
  if (!feedbackItems || feedbackItems.length === 0) {
    return <p className="text-muted-foreground py-4">No reviews yet. Be the first to leave one!</p>
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">User Reviews ({feedbackItems.length})</h3>
      {feedbackItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10 border">
                {/* Placeholder - replace with actual user avatar if available */}
                <AvatarImage
                  src={`https://avatar.vercel.sh/${item.user_id || "anonymous"}.png`}
                  alt={item.user_id || "User"}
                />
                <AvatarFallback>{(item.user_id || "A")[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm">
                    {item.user_id || "Anonymous User"} {/* Replace with actual user name */}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                    />
                  ))}
                </div>
                {item.comment && <p className="text-sm text-foreground/80 whitespace-pre-wrap">{item.comment}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

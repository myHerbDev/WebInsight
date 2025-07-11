"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Reply, Heart, Flag, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { UserAuth } from "./user-auth"

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  likes: number
  replies: Comment[]
  isLiked?: boolean
}

interface BlogCommentsProps {
  postId: string
  postTitle: string
}

export function BlogComments({ postId, postTitle }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  // Mock comments data - in a real app, this would come from an API
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: "1",
        author: "Sarah Johnson",
        content:
          "Great article! The sustainability tips are really practical and easy to implement. I've already started optimizing my website's images.",
        createdAt: "2024-01-16T10:30:00Z",
        likes: 12,
        replies: [
          {
            id: "1-1",
            author: "Mike Chen",
            content: "I agree! The WebP format made a huge difference for my site's loading speed.",
            createdAt: "2024-01-16T11:15:00Z",
            likes: 3,
            replies: [],
          },
        ],
      },
      {
        id: "2",
        author: "Alex Rodriguez",
        content:
          "The section on green hosting providers was particularly helpful. I had no idea about the environmental impact of data centers.",
        createdAt: "2024-01-16T14:20:00Z",
        likes: 8,
        replies: [],
      },
      {
        id: "3",
        author: "Emma Thompson",
        content:
          "Would love to see more content about accessibility optimization. It's such an important topic that often gets overlooked.",
        createdAt: "2024-01-16T16:45:00Z",
        likes: 15,
        replies: [],
      },
    ]
    setComments(mockComments)
  }, [postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setIsSubmitting(true)
    try {
      // In a real app, this would be an API call
      const comment: Comment = {
        id: Date.now().toString(),
        author: user.email || "Anonymous",
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      }

      setComments((prev) => [comment, ...prev])
      setNewComment("")
      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to post comment",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return

    setIsSubmitting(true)
    try {
      const reply: Comment = {
        id: `${parentId}-${Date.now()}`,
        author: user.email || "Anonymous",
        content: replyContent.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
        ),
      )

      setReplyContent("")
      setReplyingTo(null)
      toast({
        title: "Reply posted!",
        description: "Your reply has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to post reply",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like comments.",
      })
      return
    }

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          }
        }
        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === commentId
              ? {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked,
                }
              : reply,
          ),
        }
      }),
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
          <AvatarFallback>
            {comment.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm leading-relaxed">{comment.content}</p>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => handleLikeComment(comment.id)}
            >
              <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`} />
              {comment.likes}
            </Button>
            {!isReply && user && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground">
              <Flag className="h-3 w-3 mr-1" />
              Report
            </Button>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="ml-11 space-y-3">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleSubmitReply(comment.id)}
              disabled={!replyContent.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Reply"
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                <AvatarFallback>
                  {user.email?.split("@")[0].split("").slice(0, 2).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your thoughts about this article..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Join the conversation</h3>
            <p className="text-muted-foreground mb-4">Sign in to share your thoughts and engage with other readers.</p>
            <UserAuth />
          </div>
        )}

        {comments.length > 0 && <Separator />}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        {comments.length === 0 && user && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Be the first to comment on this article!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

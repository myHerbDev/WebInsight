"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, notFound } from "next/navigation" // use notFound for 404
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Leaf, Shield, Zap, Users, ExternalLink, ArrowLeft, CheckCircle, Clock, Tag, MapPin, Award } from "lucide-react"
import Link from "next/link"
import { HostingFeedbackForm } from "@/components/hosting-feedback-form"
import { HostingFeedbackList, type FeedbackItem } from "@/components/hosting-feedback-list"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

interface HostingProvider {
  id: number
  name: string
  website: string
  description?: string
  sustainability_score: number
  renewable_energy_percentage: number
  carbon_neutral: boolean
  green_certifications: string[]
  data_center_locations: string[]
  pricing_tier: string
  performance_rating: number
  security_features: string[]
  uptime_guarantee: number
  support_quality: number // Assuming 1-5 or 1-100 scale
  created_at: string
  updated_at: string
}

export default function HostingProviderDetailPage() {
  const params = useParams()
  const providerId = Number.parseInt(params.id as string, 10)

  const [provider, setProvider] = useState<HostingProvider | null>(null)
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProviderDetails = useCallback(async () => {
    if (isNaN(providerId)) {
      setError("Invalid provider ID.")
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const [providerRes, feedbackRes] = await Promise.all([
        fetch(`/api/hosting-providers/${providerId}`),
        fetch(`/api/hosting-providers/${providerId}/feedback`),
      ])

      if (!providerRes.ok) {
        if (providerRes.status === 404) throw new Error("ProviderNotFound")
        throw new Error(`Failed to fetch provider details (Status: ${providerRes.status})`)
      }
      const providerData = await providerRes.json()
      setProvider(providerData)

      if (!feedbackRes.ok) {
        throw new Error(`Failed to fetch feedback (Status: ${feedbackRes.status})`)
      }
      const feedbackData = await feedbackRes.json()
      setFeedbackItems(feedbackData)
    } catch (err: any) {
      console.error("Error fetching data:", err)
      if (err.message === "ProviderNotFound") {
        setError("ProviderNotFound") // Special error state for notFound()
      } else {
        setError(err.message || "An unknown error occurred")
        toast({ title: "Error", description: err.message || "Could not load provider data.", variant: "destructive" })
      }
    } finally {
      setIsLoading(false)
    }
  }, [providerId])

  useEffect(() => {
    fetchProviderDetails()
  }, [fetchProviderDetails])

  const handleFeedbackSubmitted = (newFeedback: FeedbackItem) => {
    setFeedbackItems((prevFeedback) => [newFeedback, ...prevFeedback])
  }

  if (error === "ProviderNotFound") {
    notFound() // This will render the not-found.tsx page
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error && error !== "ProviderNotFound") {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold text-destructive mb-4">Error Loading Provider</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchProviderDetails}>Try Again</Button>
      </div>
    )
  }

  if (!provider) {
    // This case should ideally be handled by isLoading or error state,
    // but as a fallback if notFound() wasn't triggered by error state.
    return notFound()
  }

  const getScoreColor = (score: number, threshold1 = 60, threshold2 = 80) => {
    if (score >= threshold2) return "text-green-500"
    if (score >= threshold1) return "text-yellow-500"
    return "text-red-500"
  }

  const detailItems = [
    {
      icon: Leaf,
      label: "Sustainability Score",
      value: `${provider.sustainability_score}%`,
      color: getScoreColor(provider.sustainability_score),
      progress: provider.sustainability_score,
    },
    {
      icon: Zap,
      label: "Performance Rating",
      value: `${provider.performance_rating}%`,
      color: getScoreColor(provider.performance_rating),
      progress: provider.performance_rating,
    },
    {
      icon: Shield,
      label: "Security Features",
      value: provider.security_features.join(", ") || "N/A",
      items: provider.security_features,
    },
    {
      icon: Clock,
      label: "Uptime Guarantee",
      value: `${provider.uptime_guarantee}%`,
      color: getScoreColor(provider.uptime_guarantee, 99, 99.9),
      progress: provider.uptime_guarantee,
    },
    {
      icon: Users,
      label: "Support Quality",
      value: `${provider.support_quality}/100`,
      color: getScoreColor(provider.support_quality),
      progress: provider.support_quality,
    }, // Assuming 0-100 scale
    {
      icon: CheckCircle,
      label: "Carbon Neutral",
      value: provider.carbon_neutral ? "Yes" : "No",
      badge: provider.carbon_neutral ? "green" : "gray",
    },
    { icon: Tag, label: "Pricing Tier", value: provider.pricing_tier, badge: "blue" },
    {
      icon: MapPin,
      label: "Data Centers",
      value: provider.data_center_locations.join(", ") || "N/A",
      items: provider.data_center_locations,
    },
    {
      icon: Award,
      label: "Green Certs",
      value: provider.green_certifications.join(", ") || "N/A",
      items: provider.green_certifications,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/hosting">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Providers
        </Link>
      </Button>

      <Card className="mb-8 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-background to-background p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-primary mb-1">{provider.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {provider.description || "Detailed information about this hosting provider."}
              </CardDescription>
            </div>
            <Button
              variant="default"
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 text-white mt-2 sm:mt-0"
            >
              <a href={provider.website} target="_blank" rel="noopener noreferrer">
                Visit Website <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detailItems.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.progress !== undefined ? (
                <>
                  <p className={`text-lg font-semibold ${item.color || ""}`}>{item.value}</p>
                  <Progress
                    value={item.progress}
                    className="h-2 [&>*]:bg-current"
                    indicatorClassName={item.color || "bg-primary"}
                  />
                </>
              ) : item.badge ? (
                <Badge
                  variant={item.badge === "green" ? "default" : item.badge === "blue" ? "secondary" : "outline"}
                  className={
                    item.badge === "green"
                      ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      : item.badge === "blue"
                        ? "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                        : ""
                  }
                >
                  {item.value}
                </Badge>
              ) : item.items && item.items.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.items.slice(0, 3).map((val) => (
                    <Badge key={val} variant="outline" className="text-xs">
                      {val}
                    </Badge>
                  ))}
                  {item.items.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.items.length - 3} more
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-lg font-semibold">{item.value}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator className="my-10" />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <HostingFeedbackList feedbackItems={feedbackItems} />
        </div>
        <div>
          <HostingFeedbackForm providerId={provider.id} onFeedbackSubmitted={handleFeedbackSubmitted} />
        </div>
      </div>
    </div>
  )
}

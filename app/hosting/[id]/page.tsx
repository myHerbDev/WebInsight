"use client"

import { Alert } from "@/components/ui/alert"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Leaf,
  Zap,
  Shield,
  Globe,
  ExternalLink,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster" // Ensure Toaster is imported

// Re-using the interface, ideally this would be in a shared types file
interface HostingProvider {
  id: number
  name: string
  website: string
  sustainability_score: number
  renewable_energy_percentage: number
  carbon_neutral: boolean
  green_certifications: string[]
  data_center_locations: string[]
  pricing_tier: string
  performance_rating: number
  security_features: string[]
  uptime_guarantee: number
  support_quality: number
  description?: string
  user_reviews_score?: number
  features_list?: { name: string; available: boolean }[]
}

export default function HostingProviderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [provider, setProvider] = useState<HostingProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchProviderDetails(id)
    }
  }, [id])

  const fetchProviderDetails = async (providerId: string) => {
    setLoading(true)
    setError(null)
    try {
      // Attempt to fetch the full list and find the provider
      // In a real app, you'd ideally have an API endpoint: /api/hosting-providers/${providerId}
      const response = await fetch("/api/hosting-providers")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch provider list")
      }
      const allProviders: HostingProvider[] = await response.json()
      const detailedProvider = allProviders.find((p) => p.id.toString() === providerId)

      if (detailedProvider) {
        // Simulate fetching more details or augmenting existing ones
        setProvider({
          ...detailedProvider,
          description:
            detailedProvider.description ||
            `Detailed information about ${detailedProvider.name}, focusing on their hosting services, performance, and sustainability efforts. This provider is known for its ${detailedProvider.pricing_tier} pricing and ${detailedProvider.performance_rating}% performance rating.`,
          user_reviews_score: detailedProvider.user_reviews_score || Math.floor(Math.random() * (95 - 70 + 1)) + 70, // Random score if not present
          features_list: detailedProvider.features_list || [
            // Example features
            { name: "Free Daily Backups", available: Math.random() > 0.3 },
            { name: "24/7 Expert Support", available: Math.random() > 0.2 },
            { name: "Free SSL Certificate", available: true },
            { name: "99.9% Uptime Guarantee", available: true },
            { name: "Website Builder", available: Math.random() > 0.5 },
            { name: "Automated Malware Scans", available: Math.random() > 0.4 },
          ],
        })
      } else {
        setError(`Hosting provider with ID ${providerId} not found.`)
        toast({ title: "Error", description: `Provider not found.`, variant: "destructive" })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load provider details."
      setError(msg)
      toast({ title: "Error", description: msg, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getTierBadgeClass = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "budget":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "mid-range":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "premium":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
      case "enterprise":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-DEFAULT" />
        </main>
        <Footer />
        <Toaster />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Catalog
          </Button>
          <Alert variant="destructive">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Error Loading Provider</CardTitle>
            <CardDescription>{error}</CardDescription>
          </Alert>
        </main>
        <Footer />
        <Toaster />
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Catalog
          </Button>
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">Provider details not found.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
        <Toaster />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Catalog
        </Button>

        <Card className="shadow-xl overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="bg-gradient-to-r from-brand-light/50 via-blue-50 to-sky-100 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-900/70 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {provider.name}
                </CardTitle>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-DEFAULT hover:underline flex items-center text-sm"
                >
                  {provider.website} <ExternalLink className="h-3 w-3 ml-1.5" />
                </a>
              </div>
              <Badge className={`mt-2 sm:mt-0 text-sm px-3 py-1.5 ${getTierBadgeClass(provider.pricing_tier)}`}>
                {provider.pricing_tier}
              </Badge>
            </div>
            {provider.description && (
              <CardDescription className="mt-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                {provider.description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="p-6 sm:p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Column 1: Scores */}
            <div className="space-y-6">
              <Card className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-700 dark:text-slate-200">
                    <Leaf className="mr-2 h-5 w-5 text-green-500" />
                    Sustainability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Overall Score</span>{" "}
                      <strong className={getScoreColor(provider.sustainability_score)}>
                        {provider.sustainability_score}%
                      </strong>
                    </div>
                    <Progress
                      value={provider.sustainability_score}
                      className="h-2.5 bg-slate-200 dark:bg-slate-700"
                      indicatorClassName={getScoreColor(provider.sustainability_score).replace("text-", "bg-")}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Renewable Energy</span>{" "}
                      <strong className="text-green-500">{provider.renewable_energy_percentage}%</strong>
                    </div>
                    <Progress
                      value={provider.renewable_energy_percentage}
                      className="h-2.5 bg-slate-200 dark:bg-slate-700"
                      indicatorClassName="bg-green-500"
                    />
                  </div>
                  <div className="flex items-center pt-1">
                    {provider.carbon_neutral ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {provider.carbon_neutral ? "Carbon Neutral" : "Not Carbon Neutral"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-700 dark:text-slate-200">
                    <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Overall Rating</span>{" "}
                      <strong className={getScoreColor(provider.performance_rating)}>
                        {provider.performance_rating}%
                      </strong>
                    </div>
                    <Progress
                      value={provider.performance_rating}
                      className="h-2.5 bg-slate-200 dark:bg-slate-700"
                      indicatorClassName={getScoreColor(provider.performance_rating).replace("text-", "bg-")}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Uptime Guarantee</span>{" "}
                      <strong className="text-slate-700 dark:text-slate-300">{provider.uptime_guarantee}%</strong>
                    </div>
                    <Progress
                      value={provider.uptime_guarantee}
                      className="h-2.5 bg-slate-200 dark:bg-slate-700"
                      indicatorClassName="bg-sky-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {provider.user_reviews_score && (
                <Card className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center text-slate-700 dark:text-slate-200">
                      <Star className="mr-2 h-5 w-5 text-amber-500" />
                      User Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Average Score</span>{" "}
                      <strong className={getScoreColor(provider.user_reviews_score)}>
                        {provider.user_reviews_score}/100
                      </strong>
                    </div>
                    <Progress
                      value={provider.user_reviews_score}
                      className="h-2.5 bg-slate-200 dark:bg-slate-700"
                      indicatorClassName={getScoreColor(provider.user_reviews_score).replace("text-", "bg-")}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Column 2: Features & Locations */}
            <div className="space-y-6">
              <Card className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-700 dark:text-slate-200">
                    <Shield className="mr-2 h-5 w-5 text-blue-500" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    {provider.security_features.slice(0, 5).map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {provider.security_features.length > 5 && (
                      <li className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        +{provider.security_features.length - 5} more features
                      </li>
                    )}
                    {provider.security_features.length === 0 && (
                      <li className="text-xs text-slate-500 dark:text-slate-400">Standard security measures.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {provider.features_list && provider.features_list.length > 0 && (
                <Card className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-700 dark:text-slate-200">Key Service Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                      {provider.features_list.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          {feature.available ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-2 shrink-0" />
                          )}
                          {feature.name}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-700 dark:text-slate-200">
                    <Globe className="mr-2 h-5 w-5 text-sky-500" />
                    Data Center Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {provider.data_center_locations.map((loc, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                      >
                        {loc}
                      </Badge>
                    ))}
                    {provider.data_center_locations.length === 0 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">Location information not specified.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Column 3: Certifications & Support */}
            <div className="space-y-6 md:col-span-2 lg:col-span-1">
              <Card className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-700 dark:text-slate-200">Green Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {provider.green_certifications.length > 0 ? (
                    <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                      {provider.green_certifications.map((cert, i) => (
                        <li key={i} className="flex items-center">
                          <Leaf className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No specific green certifications listed.
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-700 dark:text-slate-200">Support Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Rating</span>{" "}
                    <strong className={getScoreColor(provider.support_quality)}>{provider.support_quality}/100</strong>
                  </div>
                  <Progress
                    value={provider.support_quality}
                    className="h-2.5 bg-slate-200 dark:bg-slate-700"
                    indicatorClassName={getScoreColor(provider.support_quality).replace("text-", "bg-")}
                  />
                </CardContent>
              </Card>
              <Button
                asChild
                size="lg"
                className="w-full bg-brand-DEFAULT hover:bg-brand-dark text-white py-3 text-base"
              >
                <a href={provider.website} target="_blank" rel="noopener noreferrer">
                  Visit {provider.name} <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

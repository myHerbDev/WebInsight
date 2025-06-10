"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Leaf, Zap, ExternalLink, SortAsc, SortDesc, Award, Star, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Logo } from "@/components/logo"
import Link from "next/link"

interface HostingProvider {
  id: string // Changed to string to match API potential from DB
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
  average_rating?: number // Optional, as not all entries might have it
  review_count?: number // Optional
  features?: string[] // Optional
}

export default function HostingProvidersPage() {
  const [providers, setProviders] = useState<HostingProvider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<HostingProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("sustainability_score")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterTier, setFilterTier] = useState("all")
  const [filterGreen, setFilterGreen] = useState("all")

  useEffect(() => {
    fetchProviders()
  }, [])

  useEffect(() => {
    if (providers.length > 0) {
      // Only filter if providers is not empty
      filterAndSortProviders()
    }
  }, [providers, searchTerm, sortBy, sortOrder, filterTier, filterGreen])

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/hosting-providers")
      if (response.ok) {
        const responseBody = await response.json()
        if (responseBody && responseBody.data && Array.isArray(responseBody.data)) {
          setProviders(responseBody.data)
        } else {
          console.error("Unexpected API response structure:", responseBody)
          setProviders([])
          toast({
            title: "Data Error",
            description: "Received invalid data format for hosting providers.",
            variant: "destructive",
          })
        }
      } else {
        throw new Error(`Failed to fetch providers: ${response.statusText}`)
      }
    } catch (error: any) {
      console.error("Error fetching providers:", error)
      setProviders([]) // Set to empty array on error
      toast({
        title: "Error",
        description: error.message || "Failed to load hosting providers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProviders = () => {
    if (!Array.isArray(providers)) {
      // Guard against providers not being an array
      setFilteredProviders([])
      return
    }
    const tempFiltered = [...providers].filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.website.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTier = filterTier === "all" || provider.pricing_tier.toLowerCase() === filterTier.toLowerCase()

      const matchesGreen =
        filterGreen === "all" ||
        (filterGreen === "green" && provider.carbon_neutral) ||
        (filterGreen === "not-green" && !provider.carbon_neutral)

      return matchesSearch && matchesTier && matchesGreen
    })

    tempFiltered.sort((a, b) => {
      let aValue = a[sortBy as keyof HostingProvider]
      let bValue = b[sortBy as keyof HostingProvider]

      // Handle cases where values might be undefined for sorting
      if (aValue === undefined) aValue = sortOrder === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
      if (bValue === undefined) bValue = sortOrder === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
    setFilteredProviders(tempFiltered)
  }

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "budget":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      case "mid-range":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "premium":
        return "bg-gradient-to-r from-purple-500 to-violet-500 text-white"
      case "enterprise":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const getScoreColor = (score: number | undefined) => {
    if (score === undefined) return "text-gray-500"
    if (score >= 90) return "text-emerald-500 dark:text-emerald-400"
    if (score >= 80) return "text-green-500 dark:text-green-400"
    if (score >= 70) return "text-yellow-500 dark:text-yellow-400"
    if (score >= 60) return "text-orange-500 dark:text-orange-400"
    return "text-red-500 dark:text-red-400"
  }

  const getScoreGradient = (score: number | undefined) => {
    if (score === undefined) return "from-gray-400 to-gray-500"
    if (score >= 90) return "from-emerald-500 to-green-500"
    if (score >= 80) return "from-green-500 to-lime-500"
    if (score >= 70) return "from-yellow-500 to-orange-500"
    if (score >= 60) return "from-orange-500 to-red-500"
    return "from-red-500 to-pink-500"
  }

  if (loading) {
    return (
      <div className="min-h-screen futuristic-bg">
        <div className="grid-pattern"></div> <div className="orb orb-1"></div> <div className="orb orb-2"></div>{" "}
        <div className="orb orb-3"></div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-6"></div>
              <p className="text-lg text-gray-300">Loading Sustainable Hosts...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen futuristic-bg">
      <div className="grid-pattern"></div> <div className="orb orb-1"></div> <div className="orb orb-2"></div>{" "}
      <div className="orb orb-3"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4" data-text="Sustainable Hosting Catalog">
            Sustainable Hosting Catalog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover top hosting providers, rated for sustainability, performance, and user satisfaction. Make an
            informed, eco-conscious choice.
          </p>
        </div>

        <div className="bg-background/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-2xl border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 futuristic-input--alt"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="futuristic-input--alt">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sustainability_score">Sustainability</SelectItem>
                <SelectItem value="performance_rating">Performance</SelectItem>
                <SelectItem value="average_rating">User Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="futuristic-input--alt">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="mid-range">Mid-range</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterGreen} onValueChange={setFilterGreen}>
              <SelectTrigger className="futuristic-input--alt">
                <SelectValue placeholder="Green hosting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="green">Carbon Neutral</SelectItem>
                <SelectItem value="not-green">Not Carbon Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="futuristic-button--secondary"
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
            <span className="text-sm text-muted-foreground">
              Showing {filteredProviders.length} of {providers.length} providers
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProviders.map((provider) => (
            <Card
              key={provider.id}
              className="futuristic-card glassmorphism-effect group hover:border-purple-500/50 transition-all duration-300"
            >
              <CardHeader className="relative overflow-hidden pb-4">
                {provider.sustainability_score >= 95 && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 text-xs font-bold shadow-lg">
                    <Award className="h-3 w-3 mr-1" /> TOP SUSTAINABLE
                  </Badge>
                )}
                <div className="flex items-center space-x-3">
                  {/* Placeholder for actual logo - could fetch from a URL if available */}
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getScoreGradient(provider.sustainability_score)} flex items-center justify-center text-white text-xl font-bold`}
                  >
                    {provider.name.substring(0, 1)}
                  </div>
                  <div>
                    <CardTitle
                      className="text-xl font-bold text-foreground group-hover:gradient-text transition-colors"
                      data-text={provider.name}
                    >
                      {provider.name}
                    </CardTitle>
                    <Link
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                    >
                      Visit Website <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {[
                    { label: "Sustainability", value: provider.sustainability_score, icon: Leaf, unit: "%" },
                    { label: "Performance", value: provider.performance_rating, icon: Zap, unit: "%" },
                    {
                      label: "User Rating",
                      value: provider.average_rating,
                      icon: Star,
                      unit: `/5 (${provider.review_count || 0} reviews)`,
                    },
                    { label: "Uptime", value: provider.uptime_guarantee, icon: CheckCircle, unit: "%" },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <metric.icon className={`h-4 w-4 mr-2 ${getScoreColor(metric.value)}`} />
                        <span>{metric.label}</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className={`text-lg font-bold ${getScoreColor(metric.value)}`}>
                          {metric.value ?? "N/A"}
                        </span>
                        <span className="text-xs text-muted-foreground ml-0.5">{metric.unit}</span>
                      </div>
                      <div className="relative h-2 bg-gray-700/50 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getScoreGradient(metric.value)} transition-all duration-500`}
                          style={{
                            width: `${metric.value && metric.label !== "User Rating" ? metric.value : (metric.value || 0) * 20}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {provider.carbon_neutral && (
                  <Badge className="bg-green-600/20 text-green-300 border-green-500/50 py-1 px-2">
                    <Leaf className="h-3 w-3 mr-1" />
                    Carbon Neutral
                  </Badge>
                )}
                {provider.green_certifications && provider.green_certifications.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1 text-muted-foreground">Certifications:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.green_certifications.slice(0, 3).map((cert, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-gray-600 text-gray-400">
                          {cert}
                        </Badge>
                      ))}
                      {provider.green_certifications.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                          +{provider.green_certifications.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  className="w-full futuristic-button--secondary mt-4"
                  onClick={() => {
                    // This would navigate to a detailed page for the provider
                    // For now, let's just toast
                    toast({
                      title: "Coming Soon!",
                      description: `Detailed page for ${provider.name} is under construction.`,
                    })
                  }}
                >
                  More Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && !loading && (
          <div className="text-center py-16 col-span-full">
            <div className="futuristic-card glassmorphism-effect p-12 max-w-md mx-auto">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Providers Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { Alert } from "@/components/ui/alert"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Leaf,
  Shield,
  Zap,
  Globe,
  ExternalLink,
  SortAsc,
  SortDesc,
  AlertTriangle,
  Star,
  Award,
  TreePine,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoadingAnimation } from "@/components/loading-animation"
import { Toaster } from "@/components/ui/toaster"

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
}

export default function HostingProvidersPage() {
  const [providers, setProviders] = useState<HostingProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("sustainability_score")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterTier, setFilterTier] = useState("all")
  const [apiError, setApiError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    setLoading(true)
    setApiError(null)
    try {
      const response = await fetch("/api/hosting-providers")
      if (response.ok) {
        const data = await response.json()
        setProviders(data)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch providers")
      }
    } catch (error) {
      console.error("Error fetching providers:", error)
      const message = error instanceof Error ? error.message : "Unknown error occurred"
      setApiError(message)
      toast({
        title: "Error",
        description: `Failed to load hosting providers: ${message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const { greenProviders, lessGreenProviders, filteredAndSortedProviders } = useMemo(() => {
    let tempProviders = [...providers]

    // Filter by search term
    tempProviders = tempProviders.filter((provider) => {
      const nameMatch = provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      const websiteMatch = provider.website.toLowerCase().includes(searchTerm.toLowerCase())
      const searchMatch = nameMatch || websiteMatch
      const tierMatch = filterTier === "all" || provider.pricing_tier === filterTier
      return searchMatch && tierMatch
    })

    // Sort providers
    tempProviders.sort((a, b) => {
      let aValue = a[sortBy as keyof HostingProvider]
      let bValue = b[sortBy as keyof HostingProvider]
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      const valA = typeof aValue === "boolean" ? (aValue ? 1 : 0) : aValue
      const valB = typeof bValue === "boolean" ? (bValue ? 1 : 0) : bValue
      if (sortOrder === "asc") {
        return valA < valB ? -1 : valA > valB ? 1 : 0
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0
      }
    })

    // Categorize providers
    const green = tempProviders.filter((p) => p.sustainability_score >= 75 || p.carbon_neutral)
    const lessGreen = tempProviders.filter((p) => p.sustainability_score < 75 && !p.carbon_neutral)

    // Filter by active tab
    let filtered = tempProviders
    if (activeTab === "green") filtered = green
    if (activeTab === "less-green") filtered = lessGreen

    return {
      greenProviders: green,
      lessGreenProviders: lessGreen,
      filteredAndSortedProviders: filtered,
    }
  }, [providers, searchTerm, sortBy, sortOrder, filterTier, activeTab])

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "budget":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
      case "mid-range":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700"
      case "premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-700"
      case "enterprise":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300 dark:border-orange-700"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300 border-gray-300 dark:border-gray-600"
    }
  }

  const getScoreIndicatorClass = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-green-500 to-emerald-500"
    if (score >= 60) return "bg-gradient-to-r from-yellow-500 to-orange-500"
    return "bg-gradient-to-r from-red-500 to-pink-500"
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 20) // Convert to 5-star scale
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < stars ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">({rating}%)</span>
      </div>
    )
  }

  const ProviderCard = ({ provider }: { provider: HostingProvider }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-gradient-start/5 to-primary-gradient-end/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary-gradient-start transition-colors">
              {provider.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge
                variant="outline"
                className={`${getTierColor(provider.pricing_tier)} px-2.5 py-1 text-xs font-medium`}
              >
                {provider.pricing_tier}
              </Badge>
              {provider.carbon_neutral && (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700 px-2.5 py-1 text-xs font-medium"
                >
                  <TreePine className="h-3 w-3 mr-1" />
                  Carbon Neutral
                </Badge>
              )}
              {provider.green_certifications.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700 px-2.5 py-1 text-xs font-medium"
                >
                  <Award className="h-3 w-3 mr-1" />
                  Certified
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-slate-500 hover:text-primary-gradient-start dark:text-slate-400 dark:hover:text-primary-gradient-start -mt-1 -mr-1 transition-colors"
          >
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${provider.name} website`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-sm flex-grow relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-slate-600 dark:text-slate-300">Sustainability</span>
              <span className={`font-bold ${getScoreTextColor(provider.sustainability_score)}`}>
                {provider.sustainability_score}%
              </span>
            </div>
            <Progress
              value={provider.sustainability_score}
              className="h-2 bg-slate-200 dark:bg-slate-700"
              indicatorClassName={getScoreIndicatorClass(provider.sustainability_score)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-slate-600 dark:text-slate-300">Performance</span>
              <span className={`font-bold ${getScoreTextColor(provider.performance_rating)}`}>
                {provider.performance_rating}%
              </span>
            </div>
            <Progress
              value={provider.performance_rating}
              className="h-2 bg-slate-200 dark:bg-slate-700"
              indicatorClassName={getScoreIndicatorClass(provider.performance_rating)}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-slate-600 dark:text-slate-300">Renewable Energy</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {provider.renewable_energy_percentage}%
            </span>
          </div>
          <Progress
            value={provider.renewable_energy_percentage}
            className="h-2 bg-slate-200 dark:bg-slate-700"
            indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-slate-500 dark:text-slate-400">
            <Shield className="h-4 w-4 mr-2 text-blue-500 shrink-0" />
            <span className="truncate">
              {provider.security_features.length > 2
                ? `${provider.security_features.slice(0, 2).join(", ")}...`
                : provider.security_features.join(", ") || "Standard Security"}
            </span>
          </div>
          <div className="flex items-center text-slate-500 dark:text-slate-400">
            <Globe className="h-4 w-4 mr-2 text-sky-500 shrink-0" />
            <span className="truncate">
              {provider.data_center_locations.length > 2
                ? `${provider.data_center_locations.slice(0, 2).join(", ")}...`
                : provider.data_center_locations.join(", ") || "Multiple Locations"}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-yellow-500 shrink-0" />
              {provider.uptime_guarantee}% Uptime
            </div>
            {renderStars(provider.support_quality)}
          </div>
        </div>
      </CardContent>

      <div className="p-4 pt-3 mt-auto border-t border-slate-100/60 dark:border-slate-800/60 relative z-10">
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-primary-gradient hover:opacity-90 text-white dark:text-primary-foreground transition-opacity"
          >
            <Link href={`/hosting/${provider.id}`}>View Details</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-primary-gradient-start/30 text-primary-gradient-start hover:bg-primary-gradient-start/10"
          >
            <Link href={`/compare?providers=${provider.id}`}>Compare</Link>
          </Button>
        </div>
      </div>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <LoadingAnimation />
        </main>
        <Footer />
        <Toaster />
      </div>
    )
  }

  if (apiError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Failed to Load Providers</CardTitle>
            <CardDescription>{apiError}</CardDescription>
            <Button onClick={fetchProviders} className="mt-4">
              Try Again
            </Button>
          </Alert>
        </main>
        <Footer />
        <Toaster />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-4">
            Green Hosting Providers Catalog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-lg">
            Discover hosting providers committed to sustainability. Compare environmental impact, performance, and
            features to make informed decisions for responsible web hosting.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-8 p-6 shadow-lg border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative lg:col-span-2">
              <label
                htmlFor="search-providers"
                className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
              >
                Search Providers
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 mt-3 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <Input
                id="search-providers"
                placeholder="Search by name or website..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-slate-50/80 dark:bg-slate-800/80 border-slate-300/60 dark:border-slate-700/60 focus:ring-primary-gradient-start focus:border-primary-gradient-start"
              />
            </div>

            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Sort by
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  id="sort-by"
                  className="h-11 bg-slate-50/80 dark:bg-slate-800/80 border-slate-300/60 dark:border-slate-700/60"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sustainability_score">Sustainability</SelectItem>
                  <SelectItem value="performance_rating">Performance</SelectItem>
                  <SelectItem value="renewable_energy_percentage">Renewable Energy</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="pricing_tier">Pricing Tier</SelectItem>
                  <SelectItem value="support_quality">Support Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="filter-tier"
                className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
              >
                Pricing Tier
              </label>
              <Select value={filterTier} onValueChange={setFilterTier}>
                <SelectTrigger
                  id="filter-tier"
                  className="h-11 bg-slate-50/80 dark:bg-slate-800/80 border-slate-300/60 dark:border-slate-700/60"
                >
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="mid-range">Mid-range</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="border-slate-300/60 dark:border-slate-700/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredAndSortedProviders.length} of {providers.length} providers
            </p>
          </div>
        </Card>

        {/* Tabs for categorization */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary-gradient data-[state=active]:text-white">
              All Providers ({providers.length})
            </TabsTrigger>
            <TabsTrigger
              value="green"
              className="data-[state=active]:bg-primary-gradient data-[state=active]:text-white"
            >
              <Leaf className="h-4 w-4 mr-2" />
              Green Hosting ({greenProviders.length})
            </TabsTrigger>
            <TabsTrigger
              value="less-green"
              className="data-[state=active]:bg-primary-gradient data-[state=active]:text-white"
            >
              Less Green ({lessGreenProviders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filteredAndSortedProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent>
                  <Search className="h-10 w-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No hosting providers found matching your criteria.
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    Try adjusting your search or filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="green" className="mt-6">
            <div className="mb-6 p-4 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-200/60 dark:border-green-800/60">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                🌱 Green Hosting Providers
              </h3>
              <p className="text-green-700 dark:text-green-400 text-sm">
                These providers demonstrate strong commitment to environmental sustainability through renewable energy
                usage, carbon neutrality, and green certifications.
              </p>
            </div>
            {greenProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {greenProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent>
                  <Leaf className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No green hosting providers found matching your criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="less-green" className="mt-6">
            <div className="mb-6 p-4 bg-orange-50/80 dark:bg-orange-900/20 rounded-lg border border-orange-200/60 dark:border-orange-800/60">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-2">
                ⚠️ Less Green Hosting Providers
              </h3>
              <p className="text-orange-700 dark:text-orange-400 text-sm">
                These providers may offer good performance and features but have limited environmental commitments.
                Consider their sustainability practices when making your choice.
              </p>
            </div>
            {lessGreenProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessGreenProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent>
                  <AlertTriangle className="h-10 w-10 text-orange-500 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No less green hosting providers found matching your criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

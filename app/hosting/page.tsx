"use client"

import { Alert } from "@/components/ui/alert"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Leaf, Shield, Zap, Globe, ExternalLink, SortAsc, SortDesc, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoadingAnimation } from "@/components/loading-animation"
import { Toaster } from "@/components/ui/toaster" // Ensure Toaster is imported

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
  const [filterGreen, setFilterGreen] = useState("all")
  const [apiError, setApiError] = useState<string | null>(null)

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

  const filteredAndSortedProviders = useMemo(() => {
    let tempProviders = [...providers]

    tempProviders = tempProviders.filter((provider) => {
      const nameMatch = provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      const websiteMatch = provider.website.toLowerCase().includes(searchTerm.toLowerCase())
      const searchMatch = nameMatch || websiteMatch
      const tierMatch = filterTier === "all" || provider.pricing_tier === filterTier
      const greenMatch =
        filterGreen === "all" ||
        (filterGreen === "green" && provider.carbon_neutral) ||
        (filterGreen === "not-green" && !provider.carbon_neutral)
      return searchMatch && tierMatch && greenMatch
    })

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
    return tempProviders
  }, [providers, searchTerm, sortBy, sortOrder, filterTier, filterGreen])

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "budget":
        return "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300 border-green-300 dark:border-green-700"
      case "mid-range":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300 border-blue-300 dark:border-blue-700"
      case "premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-300 border-purple-300 dark:border-purple-700"
      case "enterprise":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/70 dark:text-orange-300 border-orange-300 dark:border-orange-700"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/70 dark:text-gray-300 border-gray-300 dark:border-gray-600"
    }
  }

  const getScoreIndicatorClass = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            Green Hosting Providers Catalog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Compare hosting providers based on sustainability, performance, and security. Make informed decisions for
            environmentally responsible web hosting.
          </p>
        </div>

        <Card className="mb-8 p-4 sm:p-6 shadow-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 items-end">
            <div className="relative lg:col-span-2">
              <label
                htmlFor="search-providers"
                className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
              >
                Search Providers
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 mt-2.5 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <Input
                id="search-providers"
                placeholder="Search by name or website..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-brand-DEFAULT focus:border-brand-DEFAULT"
              />
            </div>

            <div>
              <label htmlFor="sort-by" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Sort by
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  id="sort-by"
                  className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-brand-DEFAULT focus:border-brand-DEFAULT"
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

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-10 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300 focus:ring-brand-DEFAULT focus:border-brand-DEFAULT"
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>

            <div>
              <label
                htmlFor="filter-tier"
                className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
              >
                Pricing Tier
              </label>
              <Select value={filterTier} onValueChange={setFilterTier}>
                <SelectTrigger
                  id="filter-tier"
                  className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-brand-DEFAULT focus:border-brand-DEFAULT"
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

            <div>
              <label
                htmlFor="filter-green"
                className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
              >
                Green Status
              </label>
              <Select value={filterGreen} onValueChange={setFilterGreen}>
                <SelectTrigger
                  id="filter-green"
                  className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-brand-DEFAULT focus:border-brand-DEFAULT"
                >
                  <SelectValue placeholder="Green hosting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="green">Carbon Neutral</SelectItem>
                  <SelectItem value="not-green">Not Carbon Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-2 text-right mt-2 lg:mt-0 self-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {filteredAndSortedProviders.length} of {providers.length} providers
              </p>
            </div>
          </div>
        </Card>

        {providers.length > 0 ? (
          filteredAndSortedProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className="hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                          {provider.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge
                            variant="outline"
                            className={`${getTierColor(provider.pricing_tier)} px-2.5 py-1 text-xs font-medium`}
                          >
                            {provider.pricing_tier}
                          </Badge>
                          {provider.carbon_neutral && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300 border-green-300 dark:border-green-700 px-2.5 py-1 text-xs font-medium"
                            >
                              <Leaf className="h-3 w-3 mr-1.5" />
                              Carbon Neutral
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-slate-500 hover:text-brand-DEFAULT dark:text-slate-400 dark:hover:text-brand-light -mt-1 -mr-1"
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

                  <CardContent className="space-y-3 text-sm flex-grow">
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
                        <span className="font-medium text-slate-600 dark:text-slate-300">Renewable Energy</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {provider.renewable_energy_percentage}%
                        </span>
                      </div>
                      <Progress
                        value={provider.renewable_energy_percentage}
                        className="h-2 bg-slate-200 dark:bg-slate-700"
                        indicatorClassName="bg-green-500"
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

                    <div className="pt-2 space-y-1.5">
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
                      <div className="flex items-center text-slate-500 dark:text-slate-400">
                        <Zap className="h-4 w-4 mr-2 text-yellow-500 shrink-0" />
                        {provider.uptime_guarantee}% Uptime Guarantee
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/50">
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-brand-DEFAULT hover:bg-brand-dark text-white dark:text-primary-foreground"
                    >
                      <Link href={`/hosting/${provider.id}`}>View Detailed Analysis</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent>
                <Search className="h-10 w-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400">No hosting providers found matching your criteria.</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="text-center py-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent>
              <AlertTriangle className="h-10 w-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No hosting providers available in the catalog.</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Please ensure the hosting provider data has been populated by running the setup script.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

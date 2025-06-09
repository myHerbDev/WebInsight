"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Leaf, Shield, Zap, Globe, ExternalLink, SortAsc, SortDesc, Award, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Logo } from "@/components/logo"

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
    filterAndSortProviders()
  }, [providers, searchTerm, sortBy, sortOrder, filterTier, filterGreen])

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/hosting-providers")
      if (response.ok) {
        const data = await response.json()
        setProviders(data)
      } else {
        throw new Error("Failed to fetch providers")
      }
    } catch (error) {
      console.error("Error fetching providers:", error)
      toast({
        title: "Error",
        description: "Failed to load hosting providers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProviders = () => {
    const filtered = providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.website.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTier = filterTier === "all" || provider.pricing_tier === filterTier

      const matchesGreen =
        filterGreen === "all" ||
        (filterGreen === "green" && provider.carbon_neutral) ||
        (filterGreen === "not-green" && !provider.carbon_neutral)

      return matchesSearch && matchesTier && matchesGreen
    })

    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof HostingProvider]
      let bValue = b[sortBy as keyof HostingProvider]

      if (typeof aValue === "string") aValue = aValue.toLowerCase()
      if (typeof bValue === "string") bValue = bValue.toLowerCase()

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredProviders(filtered)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "budget":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      case "mid-range":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "premium":
        return "bg-gradient-to-r from-purple-500 to-violet-500 text-white"
      case "enterprise":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600"
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 90) return "from-emerald-500 to-green-500"
    if (score >= 80) return "from-green-500 to-lime-500"
    if (score >= 70) return "from-yellow-500 to-orange-500"
    if (score >= 60) return "from-orange-500 to-red-500"
    return "from-red-500 to-pink-500"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400">Loading hosting providers...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Green Hosting Providers Catalog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Compare the world's leading hosting providers based on sustainability, performance, and security metrics.
            Make informed decisions for environmentally responsible web hosting.
          </p>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-500"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-purple-200 focus:border-purple-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sustainability_score">Sustainability Score</SelectItem>
                <SelectItem value="performance_rating">Performance Rating</SelectItem>
                <SelectItem value="renewable_energy_percentage">Renewable Energy</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="pricing_tier">Pricing Tier</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="border-purple-200 focus:border-purple-500">
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

            <Select value={filterGreen} onValueChange={setFilterGreen}>
              <SelectTrigger className="border-purple-200 focus:border-purple-500">
                <SelectValue placeholder="Green hosting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="green">Carbon Neutral Only</SelectItem>
                <SelectItem value="not-green">Not Carbon Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="border-purple-200 hover:bg-purple-50"
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
            <span className="text-sm text-gray-500">
              Showing {filteredProviders.length} of {providers.length} providers
            </span>
          </div>
        </div>

        {/* Providers Grid with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProviders.map((provider) => (
            <Card
              key={provider.id}
              className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-0 shadow-lg"
            >
              <CardHeader className="relative overflow-hidden">
                {/* Gradient overlay for top performers */}
                {provider.sustainability_score >= 90 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-emerald-500 text-white px-3 py-1 rounded-bl-lg">
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      <span className="text-xs font-bold">TOP RATED</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      {provider.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge className={`${getTierColor(provider.pricing_tier)} shadow-lg`}>
                        {provider.pricing_tier}
                      </Badge>
                      {provider.carbon_neutral && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                          <Leaf className="h-3 w-3 mr-1" />
                          Carbon Neutral
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(provider.website, "_blank")}
                    className="hover:bg-purple-100 dark:hover:bg-purple-900"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Score Displays with Enhanced Visuals */}
                <div className="space-y-4">
                  {/* Sustainability Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sustainability</span>
                      <div className="flex items-center gap-1">
                        <span className={`text-lg font-bold ${getScoreColor(provider.sustainability_score)}`}>
                          {provider.sustainability_score}
                        </span>
                        <span className="text-xs text-gray-500">%</span>
                        {provider.sustainability_score >= 85 && <Star className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={provider.sustainability_score} className="h-3" />
                      <div
                        className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${getScoreGradient(provider.sustainability_score)} transition-all duration-500`}
                        style={{ width: `${provider.sustainability_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Renewable Energy */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Renewable Energy</span>
                      <span className="text-lg font-bold text-green-600">{provider.renewable_energy_percentage}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={Math.min(provider.renewable_energy_percentage, 100)} className="h-3" />
                      <div
                        className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min(provider.renewable_energy_percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Performance Rating */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Performance</span>
                      <span className={`text-lg font-bold ${getScoreColor(provider.performance_rating)}`}>
                        {provider.performance_rating}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={provider.performance_rating} className="h-3" />
                      <div
                        className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-500`}
                        style={{ width: `${provider.performance_rating}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Features with Enhanced Icons */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="h-4 w-4 mr-3 text-blue-500" />
                    <span className="font-medium">{provider.security_features.length} Security Features</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Globe className="h-4 w-4 mr-3 text-green-500" />
                    <span className="font-medium">{provider.data_center_locations.length} Global Locations</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="h-4 w-4 mr-3 text-yellow-500" />
                    <span className="font-medium">{provider.uptime_guarantee}% Uptime SLA</span>
                  </div>
                </div>

                {/* Green Certifications */}
                {provider.green_certifications.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Green Certifications</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.green_certifications.slice(0, 2).map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-green-300 text-green-700">
                          {cert}
                        </Badge>
                      ))}
                      {provider.green_certifications.length > 2 && (
                        <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                          +{provider.green_certifications.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-purple-200 hover:bg-purple-50 hover:border-purple-500"
                    onClick={() => window.open(provider.website, "_blank")}
                  >
                    Visit Website
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white shadow-lg"
                    onClick={() => {
                      window.location.href = `/hosting/${provider.id}`
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Providers Found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                No hosting providers found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

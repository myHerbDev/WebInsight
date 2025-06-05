"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Leaf, Shield, Zap, Globe, ExternalLink, SortAsc, SortDesc } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

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

    // Sort providers
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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "mid-range":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "enterprise":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Loading hosting providers...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Green Hosting Providers Catalog</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Compare hosting providers based on sustainability, performance, and security metrics. Make informed decisions
          for environmentally responsible web hosting.
        </p>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
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
            <SelectTrigger>
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
            <SelectTrigger>
              <SelectValue placeholder="Green hosting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="green">Carbon Neutral Only</SelectItem>
              <SelectItem value="not-green">Not Carbon Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
          <span className="text-sm text-gray-500">
            Showing {filteredProviders.length} of {providers.length} providers
          </span>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{provider.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getTierColor(provider.pricing_tier)}>{provider.pricing_tier}</Badge>
                    {provider.carbon_neutral && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Leaf className="h-3 w-3 mr-1" />
                        Carbon Neutral
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => window.open(provider.website, "_blank")}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Sustainability Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Sustainability Score</span>
                  <span className={`font-bold ${getScoreColor(provider.sustainability_score)}`}>
                    {provider.sustainability_score}%
                  </span>
                </div>
                <Progress value={provider.sustainability_score} className="h-2" />
              </div>

              {/* Renewable Energy */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Renewable Energy</span>
                  <span className="font-bold text-green-600">{provider.renewable_energy_percentage}%</span>
                </div>
                <Progress value={provider.renewable_energy_percentage} className="h-2" />
              </div>

              {/* Performance Rating */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Performance</span>
                  <span className={`font-bold ${getScoreColor(provider.performance_rating)}`}>
                    {provider.performance_rating}%
                  </span>
                </div>
                <Progress value={provider.performance_rating} className="h-2" />
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4 mr-2" />
                  {provider.security_features.length} Security Features
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Globe className="h-4 w-4 mr-2" />
                  {provider.data_center_locations.length} Locations
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="h-4 w-4 mr-2" />
                  {provider.uptime_guarantee}% Uptime
                </div>
              </div>

              {/* Green Certifications */}
              {provider.green_certifications.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Green Certifications</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.green_certifications.slice(0, 2).map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                    {provider.green_certifications.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{provider.green_certifications.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(provider.website, "_blank")}
                >
                  Visit Website
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    // Navigate to detailed analysis page
                    window.location.href = `/hosting/${provider.id}`
                  }}
                >
                  Detailed Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No hosting providers found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

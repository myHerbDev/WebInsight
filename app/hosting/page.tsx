"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Leaf,
  Zap,
  ExternalLink,
  SortAsc,
  SortDesc,
  Award,
  Star,
  Shield,
  Globe,
  Server,
  TreePine,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"

interface HostingProvider {
  id: string
  name: string
  website: string
  description: string
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
  average_rating?: number
  review_count?: number
  features?: string[]
  pricing_start?: string
  specialties?: string[]
}

// Comprehensive static hosting providers data
const HOSTING_PROVIDERS: HostingProvider[] = [
  {
    id: "1",
    name: "GreenGeeks",
    website: "https://www.greengeeks.com",
    description: "300% renewable energy hosting with eco-friendly web solutions and carbon-reducing technology.",
    sustainability_score: 98,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["EPA Green Power Partner", "Bonneville Environmental Foundation", "Carbon Neutral"],
    data_center_locations: ["Chicago", "Phoenix", "Amsterdam", "Toronto"],
    pricing_tier: "mid-range",
    performance_rating: 92,
    security_features: ["Real-time Security Scanning", "Nightly Backups", "SSL Certificates", "Account Isolation"],
    uptime_guarantee: 99.9,
    support_quality: 4.6,
    average_rating: 4.7,
    review_count: 1250,
    pricing_start: "$2.95/month",
    specialties: ["WordPress Hosting", "VPS", "Reseller Hosting"],
  },
  {
    id: "2",
    name: "A2 Hosting",
    website: "https://www.a2hosting.com",
    description: "Carbon neutral hosting with Turbo servers for 20x faster page loads and green initiatives.",
    sustainability_score: 85,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["Carbon Neutral", "Green Power Partner"],
    data_center_locations: ["Michigan", "Arizona", "Amsterdam", "Singapore"],
    pricing_tier: "mid-range",
    performance_rating: 95,
    security_features: ["HackScan Protection", "Dual Firewall", "SSL Certificates", "Virus Scanning"],
    uptime_guarantee: 99.9,
    support_quality: 4.5,
    average_rating: 4.6,
    review_count: 980,
    pricing_start: "$3.92/month",
    specialties: ["Turbo Hosting", "WordPress", "Developer Tools"],
  },
  {
    id: "3",
    name: "Kualo",
    website: "https://www.kualo.com",
    description: "100% renewable energy hosting with a focus on sustainability and premium performance.",
    sustainability_score: 94,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["100% Renewable Energy", "Carbon Neutral Hosting"],
    data_center_locations: ["UK", "USA"],
    pricing_tier: "premium",
    performance_rating: 90,
    security_features: ["Advanced DDoS Protection", "SSL Certificates", "Daily Backups", "Malware Scanning"],
    uptime_guarantee: 99.95,
    support_quality: 4.8,
    average_rating: 4.8,
    review_count: 450,
    pricing_start: "$4.99/month",
    specialties: ["Business Hosting", "E-commerce", "High Performance"],
  },
  {
    id: "4",
    name: "Eco Web Hosting",
    website: "https://www.ecowebhosting.co.uk",
    description: "UK-based green hosting powered entirely by renewable energy with carbon offset programs.",
    sustainability_score: 96,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["100% Renewable Energy", "Carbon Trust", "Green Web Foundation"],
    data_center_locations: ["London", "Manchester"],
    pricing_tier: "budget",
    performance_rating: 88,
    security_features: ["SSL Certificates", "Daily Backups", "Spam Protection", "Firewall"],
    uptime_guarantee: 99.9,
    support_quality: 4.4,
    average_rating: 4.5,
    review_count: 320,
    pricing_start: "$2.50/month",
    specialties: ["Shared Hosting", "WordPress", "Small Business"],
  },
  {
    id: "5",
    name: "DreamHost",
    website: "https://www.dreamhost.com",
    description: "Carbon neutral hosting with renewable energy commitment and strong privacy focus.",
    sustainability_score: 82,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["Carbon Neutral", "Renewable Energy Certified"],
    data_center_locations: ["California", "Virginia"],
    pricing_tier: "mid-range",
    performance_rating: 89,
    security_features: ["Multi-Factor Authentication", "SSL Certificates", "DDoS Protection", "Automated Backups"],
    uptime_guarantee: 100,
    support_quality: 4.3,
    average_rating: 4.4,
    review_count: 2100,
    pricing_start: "$2.59/month",
    specialties: ["WordPress", "VPS", "Dedicated Servers"],
  },
  {
    id: "6",
    name: "Krystal",
    website: "https://krystal.uk",
    description: "UK green hosting provider with 100% renewable energy and excellent customer support.",
    sustainability_score: 93,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["100% Renewable Energy", "Green Web Foundation", "Carbon Neutral"],
    data_center_locations: ["London", "Manchester"],
    pricing_tier: "mid-range",
    performance_rating: 91,
    security_features: ["Imunify360", "SSL Certificates", "Daily Backups", "DDoS Protection"],
    uptime_guarantee: 99.95,
    support_quality: 4.9,
    average_rating: 4.8,
    review_count: 650,
    pricing_start: "$3.99/month",
    specialties: ["WordPress", "Cloud Hosting", "Reseller"],
  },
  {
    id: "7",
    name: "Hostinger",
    website: "https://www.hostinger.com",
    description: "Affordable hosting with growing green initiatives and renewable energy adoption.",
    sustainability_score: 70,
    renewable_energy_percentage: 60,
    carbon_neutral: false,
    green_certifications: ["Green Initiative Partner"],
    data_center_locations: ["Lithuania", "UK", "USA", "Netherlands", "Singapore", "Brazil"],
    pricing_tier: "budget",
    performance_rating: 87,
    security_features: ["SSL Certificates", "DDoS Protection", "Weekly Backups", "Malware Scanner"],
    uptime_guarantee: 99.9,
    support_quality: 4.2,
    average_rating: 4.3,
    review_count: 5200,
    pricing_start: "$1.99/month",
    specialties: ["Shared Hosting", "VPS", "Cloud Hosting"],
  },
  {
    id: "8",
    name: "SiteGround",
    website: "https://www.siteground.com",
    description: "Premium hosting with renewable energy initiatives and excellent WordPress optimization.",
    sustainability_score: 75,
    renewable_energy_percentage: 80,
    carbon_neutral: false,
    green_certifications: ["Renewable Energy Partner"],
    data_center_locations: ["USA", "UK", "Netherlands", "Germany", "Singapore", "Australia"],
    pricing_tier: "premium",
    performance_rating: 94,
    security_features: ["AI Anti-Bot", "SSL Certificates", "Daily Backups", "Web Application Firewall"],
    uptime_guarantee: 99.99,
    support_quality: 4.7,
    average_rating: 4.6,
    review_count: 3400,
    pricing_start: "$3.99/month",
    specialties: ["WordPress", "WooCommerce", "Cloud Hosting"],
  },
  {
    id: "9",
    name: "Cloudways",
    website: "https://www.cloudways.com",
    description: "Managed cloud hosting with focus on performance and growing sustainability initiatives.",
    sustainability_score: 68,
    renewable_energy_percentage: 50,
    carbon_neutral: false,
    green_certifications: [],
    data_center_locations: ["Global - Multiple Providers"],
    pricing_tier: "premium",
    performance_rating: 96,
    security_features: ["Dedicated Firewalls", "SSL Certificates", "Regular Patching", "Two-Factor Authentication"],
    uptime_guarantee: 99.99,
    support_quality: 4.5,
    average_rating: 4.7,
    review_count: 1800,
    pricing_start: "$10/month",
    specialties: ["Managed Cloud", "WordPress", "E-commerce"],
  },
  {
    id: "10",
    name: "Namecheap",
    website: "https://www.namecheap.com",
    description: "Affordable hosting with basic green initiatives and reliable shared hosting solutions.",
    sustainability_score: 65,
    renewable_energy_percentage: 40,
    carbon_neutral: false,
    green_certifications: [],
    data_center_locations: ["USA", "UK"],
    pricing_tier: "budget",
    performance_rating: 83,
    security_features: ["SSL Certificates", "Website Backup", "Spam Protection"],
    uptime_guarantee: 99.9,
    support_quality: 4.1,
    average_rating: 4.2,
    review_count: 2800,
    pricing_start: "$1.58/month",
    specialties: ["Shared Hosting", "WordPress", "Domain Registration"],
  },
]

export default function HostingProvidersPage() {
  const [providers, setProviders] = useState<HostingProvider[]>(HOSTING_PROVIDERS)
  const [filteredProviders, setFilteredProviders] = useState<HostingProvider[]>(HOSTING_PROVIDERS)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("sustainability_score")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterTier, setFilterTier] = useState("all")
  const [filterGreen, setFilterGreen] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    filterAndSortProviders()
  }, [providers, searchTerm, sortBy, sortOrder, filterTier, filterGreen, activeTab])

  const filterAndSortProviders = () => {
    let tempFiltered = [...providers]

    // Apply tab filter
    if (activeTab === "green") {
      tempFiltered = tempFiltered.filter((p) => p.sustainability_score >= 80 || p.carbon_neutral)
    } else if (activeTab === "performance") {
      tempFiltered = tempFiltered.filter((p) => p.performance_rating >= 90)
    } else if (activeTab === "budget") {
      tempFiltered = tempFiltered.filter((p) => p.pricing_tier === "budget")
    }

    // Apply search filter
    if (searchTerm) {
      tempFiltered = tempFiltered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.specialties?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply tier filter
    if (filterTier !== "all") {
      tempFiltered = tempFiltered.filter((p) => p.pricing_tier === filterTier)
    }

    // Apply green filter
    if (filterGreen === "green") {
      tempFiltered = tempFiltered.filter((p) => p.carbon_neutral)
    } else if (filterGreen === "not-green") {
      tempFiltered = tempFiltered.filter((p) => !p.carbon_neutral)
    }

    // Apply sorting
    tempFiltered.sort((a, b) => {
      let aValue = a[sortBy as keyof HostingProvider]
      let bValue = b[sortBy as keyof HostingProvider]

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

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500"
    if (score >= 80) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    if (score >= 60) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 90) return "from-emerald-500 to-green-500"
    if (score >= 80) return "from-green-500 to-lime-500"
    if (score >= 70) return "from-yellow-500 to-orange-500"
    if (score >= 60) return "from-orange-500 to-red-500"
    return "from-red-500 to-pink-500"
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 opacity-50" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i} className="h-3 w-3 text-gray-300" />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Sustainable Hosting Providers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover eco-friendly hosting solutions that reduce your website's carbon footprint while delivering
            exceptional performance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <TreePine className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {providers.filter((p) => p.carbon_neutral).length}
              </div>
              <div className="text-sm text-gray-500">Carbon Neutral</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {providers.filter((p) => p.performance_rating >= 90).length}
              </div>
              <div className="text-sm text-gray-500">High Performance</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {providers.filter((p) => p.sustainability_score >= 90).length}
              </div>
              <div className="text-sm text-gray-500">Top Sustainable</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{providers.length}</div>
              <div className="text-sm text-gray-500">Total Providers</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                <SelectItem value="performance_rating">Performance</SelectItem>
                <SelectItem value="average_rating">User Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger>
                <SelectValue placeholder="Pricing Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="mid-range">Mid-range</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterGreen} onValueChange={setFilterGreen}>
              <SelectTrigger>
                <SelectValue placeholder="Green Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="green">Carbon Neutral</SelectItem>
                <SelectItem value="not-green">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
            <span className="text-sm text-gray-500">
              Showing {filteredProviders.length} of {providers.length} providers
            </span>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Providers</TabsTrigger>
            <TabsTrigger value="green">
              <Leaf className="h-4 w-4 mr-2" />
              Green
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Zap className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="budget">Budget Friendly</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className="group hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md"
                >
                  <CardHeader className="relative">
                    {provider.sustainability_score >= 90 && (
                      <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        Top Green
                      </Badge>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 group-hover:text-green-600 transition-colors">
                          {provider.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(provider.average_rating || 0)}
                          <span className="text-sm text-gray-500">({provider.review_count} reviews)</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{provider.description}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Sustainability</span>
                          <span className={`text-sm font-bold ${getScoreColor(provider.sustainability_score)}`}>
                            {provider.sustainability_score}%
                          </span>
                        </div>
                        <Progress value={provider.sustainability_score} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Performance</span>
                          <span className={`text-sm font-bold ${getScoreColor(provider.performance_rating)}`}>
                            {provider.performance_rating}%
                          </span>
                        </div>
                        <Progress value={provider.performance_rating} className="h-2" />
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <TreePine className="h-4 w-4 mr-2 text-green-500" />
                        <span>{provider.renewable_energy_percentage}% Renewable Energy</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Shield className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{provider.uptime_guarantee}% Uptime</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Server className="h-4 w-4 mr-2 text-purple-500" />
                        <span>{provider.pricing_start}</span>
                      </div>
                    </div>

                    {/* Certifications */}
                    {provider.green_certifications.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">Green Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {provider.green_certifications.slice(0, 2).map((cert, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
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

                    {/* Specialties */}
                    {provider.specialties && (
                      <div>
                        <p className="text-xs font-medium mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {provider.specialties.map((specialty, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button asChild className="flex-1">
                        <a href={provider.website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm">
                        Compare
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProviders.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No providers found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Go Green?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Make the switch to sustainable hosting and reduce your website's environmental impact while maintaining
              excellent performance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="secondary">
                <TrendingUp className="h-4 w-4 mr-2" />
                Compare Top Providers
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <Sparkles className="h-4 w-4 mr-2" />
                Get Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

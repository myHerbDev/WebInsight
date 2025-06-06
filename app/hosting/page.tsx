"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Star,
  Award,
  TreePine,
  ChevronLeft,
  ChevronRight,
  Server,
  Cloud,
  Lock,
  NetworkIcon,
  BarChart3,
  FilterIcon,
  SlidersHorizontal,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

// Static data for hosting providers
const STATIC_HOSTING_PROVIDERS = [
  {
    id: 1,
    name: "GreenHost",
    website: "https://www.greenhost.com",
    description:
      "100% renewable energy powered hosting with a focus on sustainability and minimal environmental impact.",
    sustainability_score: 95,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["Green Web Foundation", "B Corp Certified", "Climate Neutral"],
    data_center_locations: ["Netherlands", "Iceland", "Sweden"],
    pricing_tier: "mid-range",
    performance_rating: 88,
    security_features: ["DDoS Protection", "Daily Backups", "SSL Certificates", "Firewall"],
    uptime_guarantee: 99.9,
    support_quality: 4.7,
    rank: 1,
    average_rating: 4.8,
    reviews_count: 523,
    cdn_available: true,
    ssl_support: "free",
    infrastructure_type: "cloud",
  },
  {
    id: 2,
    name: "EcoWeb Solutions",
    website: "https://www.ecoweb.solutions",
    description: "Eco-friendly hosting with carbon offset programs and energy-efficient infrastructure.",
    sustainability_score: 92,
    renewable_energy_percentage: 95,
    carbon_neutral: true,
    green_certifications: ["Green Web Foundation", "Carbon Neutral Certified"],
    data_center_locations: ["Germany", "Finland", "Canada"],
    pricing_tier: "premium",
    performance_rating: 92,
    security_features: ["Advanced Firewall", "Malware Scanning", "SSL Certificates", "Two-Factor Authentication"],
    uptime_guarantee: 99.95,
    support_quality: 4.5,
    rank: 2,
    average_rating: 4.7,
    reviews_count: 412,
    cdn_available: true,
    ssl_support: "free",
    infrastructure_type: "cloud",
  },
  {
    id: 3,
    name: "SustainableServers",
    website: "https://www.sustainableservers.net",
    description: "Hosting focused on minimal resource usage and sustainable practices across all operations.",
    sustainability_score: 90,
    renewable_energy_percentage: 90,
    carbon_neutral: true,
    green_certifications: ["Green Web Foundation", "Energy Star Partner"],
    data_center_locations: ["Denmark", "Oregon, USA", "Singapore"],
    pricing_tier: "mid-range",
    performance_rating: 85,
    security_features: ["DDoS Protection", "Daily Backups", "SSL Certificates"],
    uptime_guarantee: 99.9,
    support_quality: 4.3,
    rank: 3,
    average_rating: 4.5,
    reviews_count: 387,
    cdn_available: true,
    ssl_support: "free",
    infrastructure_type: "hybrid",
  },
  {
    id: 4,
    name: "CloudGreen",
    website: "https://www.cloudgreen.tech",
    description: "High-performance cloud hosting with a commitment to renewable energy and carbon neutrality.",
    sustainability_score: 88,
    renewable_energy_percentage: 100,
    carbon_neutral: true,
    green_certifications: ["Climate Neutral", "Renewable Energy Certified"],
    data_center_locations: ["Ireland", "Oregon, USA", "Singapore", "Sydney, Australia"],
    pricing_tier: "premium",
    performance_rating: 94,
    security_features: ["Advanced Firewall", "DDoS Protection", "SSL Certificates", "Identity Management"],
    uptime_guarantee: 99.99,
    support_quality: 4.8,
    rank: 4,
    average_rating: 4.9,
    reviews_count: 612,
    cdn_available: true,
    ssl_support: "free",
    infrastructure_type: "cloud",
  },
  {
    id: 5,
    name: "EarthHost",
    website: "https://www.earthhost.eco",
    description: "Budget-friendly hosting with a strong commitment to environmental sustainability.",
    sustainability_score: 85,
    renewable_energy_percentage: 85,
    carbon_neutral: true,
    green_certifications: ["Green Web Foundation"],
    data_center_locations: ["Germany", "France", "UK"],
    pricing_tier: "budget",
    performance_rating: 80,
    security_features: ["Basic Firewall", "SSL Certificates", "Weekly Backups"],
    uptime_guarantee: 99.5,
    support_quality: 4.0,
    rank: 5,
    average_rating: 4.3,
    reviews_count: 256,
    cdn_available: false,
    ssl_support: "free",
    infrastructure_type: "shared",
  },
  {
    id: 6,
    name: "GreenScale",
    website: "https://www.greenscale.cloud",
    description: "Scalable cloud infrastructure with a focus on energy efficiency and sustainable operations.",
    sustainability_score: 82,
    renewable_energy_percentage: 80,
    carbon_neutral: true,
    green_certifications: ["Carbon Neutral Certified", "Green Power Partner"],
    data_center_locations: ["Virginia, USA", "Oregon, USA", "Ireland", "Singapore", "Tokyo, Japan"],
    pricing_tier: "enterprise",
    performance_rating: 96,
    security_features: ["Advanced Threat Protection", "Compliance Management", "Identity Services", "Encryption"],
    uptime_guarantee: 99.99,
    support_quality: 4.9,
    rank: 6,
    average_rating: 4.7,
    reviews_count: 823,
    cdn_available: true,
    ssl_support: "included",
    infrastructure_type: "cloud",
  },
  {
    id: 7,
    name: "EcoVPS",
    website: "https://www.ecovps.host",
    description: "Virtual private servers powered by renewable energy with a focus on developer-friendly features.",
    sustainability_score: 80,
    renewable_energy_percentage: 75,
    carbon_neutral: true,
    green_certifications: ["Green Web Foundation"],
    data_center_locations: ["Netherlands", "Germany", "France"],
    pricing_tier: "mid-range",
    performance_rating: 87,
    security_features: ["DDoS Protection", "Firewall", "SSL Certificates"],
    uptime_guarantee: 99.9,
    support_quality: 4.2,
    rank: 7,
    average_rating: 4.4,
    reviews_count: 312,
    cdn_available: false,
    ssl_support: "free",
    infrastructure_type: "vps",
  },
  {
    id: 8,
    name: "SustainableWP",
    website: "https://www.sustainablewp.com",
    description: "WordPress-specific hosting with eco-friendly practices and optimized performance.",
    sustainability_score: 78,
    renewable_energy_percentage: 70,
    carbon_neutral: true,
    green_certifications: ["Green Web Foundation"],
    data_center_locations: ["Canada", "UK", "Germany"],
    pricing_tier: "mid-range",
    performance_rating: 89,
    security_features: ["WordPress Security Suite", "Daily Backups", "SSL Certificates", "Malware Scanning"],
    uptime_guarantee: 99.95,
    support_quality: 4.6,
    rank: 8,
    average_rating: 4.6,
    reviews_count: 427,
    cdn_available: true,
    ssl_support: "free",
    infrastructure_type: "shared",
  },
  {
    id: 9,
    name: "GreenDedicated",
    website: "https://www.greendedicated.net",
    description: "Dedicated servers with a focus on energy efficiency and sustainable hardware lifecycle management.",
    sustainability_score: 75,
    renewable_energy_percentage: 65,
    carbon_neutral: true,
    green_certifications: ["Energy Star Partner"],
    data_center_locations: ["France", "Canada", "Germany"],
    pricing_tier: "premium",
    performance_rating: 95,
    security_features: ["Hardware Firewall", "DDoS Protection", "Custom Security Solutions"],
    uptime_guarantee: 99.99,
    support_quality: 4.7,
    rank: 9,
    average_rating: 4.5,
    reviews_count: 198,
    cdn_available: true,
    ssl_support: "included",
    infrastructure_type: "dedicated",
  },
  {
    id: 10,
    name: "EcoReseller",
    website: "https://www.ecoreseller.host",
    description: "Reseller hosting with green practices, perfect for agencies and web professionals.",
    sustainability_score: 72,
    renewable_energy_percentage: 60,
    carbon_neutral: true,
    green_certifications: ["Green Web Foundation"],
    data_center_locations: ["UK", "Germany", "USA"],
    pricing_tier: "budget",
    performance_rating: 82,
    security_features: ["SSL Certificates", "Basic Firewall", "Weekly Backups"],
    uptime_guarantee: 99.9,
    support_quality: 4.0,
    rank: 10,
    average_rating: 4.2,
    reviews_count: 156,
    cdn_available: false,
    ssl_support: "paid",
    infrastructure_type: "shared",
  },
  {
    id: 11,
    name: "CloudFlex",
    website: "https://www.cloudflex.com",
    description: "Flexible cloud infrastructure with partial renewable energy commitment and carbon offset programs.",
    sustainability_score: 68,
    renewable_energy_percentage: 55,
    carbon_neutral: false,
    green_certifications: ["Carbon Offset Partner"],
    data_center_locations: ["USA", "UK", "Germany", "Singapore", "Australia"],
    pricing_tier: "enterprise",
    performance_rating: 93,
    security_features: ["Advanced Security Suite", "Compliance Management", "Identity Services"],
    uptime_guarantee: 99.99,
    support_quality: 4.8,
    rank: 11,
    average_rating: 4.7,
    reviews_count: 542,
    cdn_available: true,
    ssl_support: "included",
    infrastructure_type: "cloud",
  },
  {
    id: 12,
    name: "ValueHost",
    website: "https://www.valuehost.net",
    description: "Budget-friendly hosting with basic sustainability initiatives and reliable service.",
    sustainability_score: 65,
    renewable_energy_percentage: 50,
    carbon_neutral: false,
    green_certifications: [],
    data_center_locations: ["USA", "UK"],
    pricing_tier: "budget",
    performance_rating: 78,
    security_features: ["Basic Firewall", "SSL Certificates"],
    uptime_guarantee: 99.5,
    support_quality: 3.8,
    rank: 12,
    average_rating: 4.0,
    reviews_count: 312,
    cdn_available: false,
    ssl_support: "paid",
    infrastructure_type: "shared",
  },
  {
    id: 13,
    name: "PerformanceVPS",
    website: "https://www.performancevps.com",
    description: "High-performance VPS hosting with some energy efficiency measures but limited green credentials.",
    sustainability_score: 60,
    renewable_energy_percentage: 40,
    carbon_neutral: false,
    green_certifications: [],
    data_center_locations: ["USA", "UK", "Singapore", "Australia"],
    pricing_tier: "mid-range",
    performance_rating: 91,
    security_features: ["DDoS Protection", "Firewall", "SSL Certificates"],
    uptime_guarantee: 99.95,
    support_quality: 4.3,
    rank: 13,
    average_rating: 4.5,
    reviews_count: 287,
    cdn_available: true,
    ssl_support: "free",
    infrastructure_type: "vps",
  },
  {
    id: 14,
    name: "RapidWeb",
    website: "https://www.rapidweb.host",
    description: "Speed-focused hosting with limited sustainability initiatives but excellent performance.",
    sustainability_score: 55,
    renewable_energy_percentage: 30,
    carbon_neutral: false,
    green_certifications: [],
    data_center_locations: ["USA", "UK", "Germany", "Japan"],
    pricing_tier: "premium",
    performance_rating: 94,
    security_features: ["Advanced Firewall", "DDoS Protection", "SSL Certificates", "Daily Backups"],
    uptime_guarantee: 99.99,
    support_quality: 4.6,
    rank: 14,
    average_rating: 4.7,
    reviews_count: 412,
    cdn_available: true,
    ssl_support: "free",
    infrastructure_type: "cloud",
  },
  {
    id: 15,
    name: "BudgetServe",
    website: "https://www.budgetserve.com",
    description: "Low-cost hosting with minimal sustainability features but reliable basic service.",
    sustainability_score: 50,
    renewable_energy_percentage: 20,
    carbon_neutral: false,
    green_certifications: [],
    data_center_locations: ["USA", "UK"],
    pricing_tier: "budget",
    performance_rating: 75,
    security_features: ["Basic Firewall", "SSL Certificates"],
    uptime_guarantee: 99.5,
    support_quality: 3.5,
    rank: 15,
    average_rating: 3.8,
    reviews_count: 245,
    cdn_available: false,
    ssl_support: "paid",
    infrastructure_type: "shared",
  },
]

// Add this after the STATIC_HOSTING_PROVIDERS array
console.log(`Loaded ${STATIC_HOSTING_PROVIDERS.length} hosting providers`)

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
  support_quality: number
  rank?: number
  average_rating?: number
  reviews_count?: number
  cdn_available?: boolean
  ssl_support?: "free" | "paid" | "included" | "none"
  infrastructure_type?: "cloud" | "dedicated" | "vps" | "shared" | "hybrid"
}

const ITEMS_PER_PAGE = 6

// Helper component for the refined filter bar
const HostingFilterBar = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filterTier,
  setFilterTier,
  totalProviders,
  filteredCount,
  currentPage,
  totalPages,
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  filterTier: string
  setFilterTier: (tier: string) => void
  totalProviders: number
  filteredCount: number
  currentPage: number
  totalPages: number
}) => {
  return (
    <Card className="mb-8 p-4 sm:p-6 shadow-xl border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-[calc(var(--header-height,64px)+1rem)] z-30 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <div className="relative lg:col-span-1">
          <label
            htmlFor="search-providers"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
          >
            <Search className="inline h-3 w-3 mr-1" /> Search Providers
          </label>
          <Input
            id="search-providers"
            placeholder="Search by name, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 bg-slate-50/80 dark:bg-slate-800/80 border-slate-300/60 dark:border-slate-700/60 focus:ring-primary-gradient-start focus:border-primary-gradient-start rounded-lg pl-8"
          />
          <Search className="absolute left-2.5 top-[calc(50%+2px)] transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>
        <div>
          <label htmlFor="sort-by" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            <SlidersHorizontal className="inline h-3 w-3 mr-1" /> Sort by
          </label>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                id="sort-by"
                className="flex-grow h-10 bg-slate-50/80 dark:bg-slate-800/80 border-slate-300/60 dark:border-slate-700/60 rounded-lg"
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank">Rank</SelectItem>
                <SelectItem value="sustainability_score">Sustainability</SelectItem>
                <SelectItem value="performance_rating">Performance</SelectItem>
                <SelectItem value="average_rating">Avg. Rating</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="h-10 w-10 border-slate-300/60 dark:border-slate-700/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-lg"
              aria-label={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div>
          <label htmlFor="filter-tier" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            <FilterIcon className="inline h-3 w-3 mr-1" /> Pricing Tier
          </label>
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger
              id="filter-tier"
              className="h-10 bg-slate-50/80 dark:bg-slate-800/80 border-slate-300/60 dark:border-slate-700/60 rounded-lg"
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
      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing {filteredCount} of {totalProviders} providers. Page {currentPage} of {totalPages}.
        </p>
      </div>
    </Card>
  )
}

export default function HostingProvidersPage() {
  const searchParams = useSearchParams() // Hook for accessing URL search parameters
  const initialViewFromQuery = searchParams.get("view")

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rank")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterTier, setFilterTier] = useState("all")
  const [activeTab, setActiveTab] = useState(initialViewFromQuery === "green" ? "green" : "all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const { greenProviders, lessGreenProviders, paginatedProviders, totalPages, totalFilteredCount } = useMemo(() => {
    let tempProviders = [...STATIC_HOSTING_PROVIDERS]

    if (searchTerm) {
      tempProviders = tempProviders.filter((provider) => {
        const nameMatch = provider.name.toLowerCase().includes(searchTerm.toLowerCase())
        const websiteMatch = provider.website.toLowerCase().includes(searchTerm.toLowerCase())
        const descriptionMatch = provider.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false
        return nameMatch || websiteMatch || descriptionMatch
      })
    }

    if (filterTier !== "all") {
      tempProviders = tempProviders.filter((provider) => provider.pricing_tier === filterTier)
    }

    // Sorting logic
    tempProviders.sort((a, b) => {
      let aValue = a[sortBy as keyof HostingProvider]
      let bValue = b[sortBy as keyof HostingProvider]

      if (sortBy === "rank" || typeof aValue === "number") {
        aValue =
          aValue === undefined || aValue === null
            ? sortOrder === "asc"
              ? Number.POSITIVE_INFINITY
              : Number.NEGATIVE_INFINITY
            : aValue
        bValue =
          bValue === undefined || bValue === null
            ? sortOrder === "asc"
              ? Number.POSITIVE_INFINITY
              : Number.NEGATIVE_INFINITY
            : bValue
      }

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

    const green = tempProviders.filter((p) => p.sustainability_score >= 75 || p.carbon_neutral)
    const lessGreen = tempProviders.filter((p) => p.sustainability_score < 75 && !p.carbon_neutral)

    let currentListToPaginate: HostingProvider[]
    switch (activeTab) {
      case "green":
        currentListToPaginate = green
        break
      case "less-green":
        currentListToPaginate = lessGreen
        break
      default:
        currentListToPaginate = tempProviders
        break
    }

    const count = currentListToPaginate.length
    const calculatedTotalPages = Math.ceil(count / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginated = currentListToPaginate.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    return {
      greenProviders: green,
      lessGreenProviders: lessGreen,
      paginatedProviders: paginated,
      totalPages: calculatedTotalPages > 0 ? calculatedTotalPages : 1, // Ensure totalPages is at least 1
      totalFilteredCount: count,
    }
  }, [searchTerm, sortBy, sortOrder, filterTier, activeTab, currentPage])

  const ProviderCard = ({ provider }: { provider: HostingProvider }) => {
    const isGreen = provider.sustainability_score >= 75 || provider.carbon_neutral
    return (
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 ease-out hover:shadow-2xl flex flex-col rounded-xl float-animation card-hover-lift", // Added float-animation card-hover-lift
          "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border glass-morphism", // Added glass-morphism
          isGreen
            ? "border-green-400/50 hover:border-green-500/80"
            : "border-slate-200/60 dark:border-slate-800/60 hover:border-primary-gradient-middle/50",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "bg-animated-gradient",
          )}
        />
        {provider.rank && (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 z-20 bg-primary-gradient text-white px-2.5 py-1 text-xs font-bold rounded-md shimmer" // Added shimmer
          >
            Rank #{provider.rank}
          </Badge>
        )}
        {isGreen && (
          <div className="absolute top-2 right-2 z-20 p-1.5 bg-green-500/10 dark:bg-green-400/10 rounded-full ring-1 ring-green-500/30">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        )}

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary-gradient-middle transition-colors">
                {provider.name}
              </CardTitle>
              {provider.average_rating !== undefined && provider.reviews_count !== undefined && (
                <div className="flex items-center mt-1.5">
                  {renderStars(provider.average_rating)}
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                    ({provider.reviews_count} reviews)
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-slate-500 hover:text-primary-gradient-middle dark:text-slate-400 dark:hover:text-primary-gradient-middle -mt-1 -mr-1 transition-colors z-20 rounded-full"
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
          {provider.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
              {provider.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-3 text-sm flex-grow relative z-10 pt-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center" title="Sustainability Score">
              <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-green-500 shrink-0" />
              Sustainability: <span className="font-semibold ml-1">{provider.sustainability_score}%</span>
            </div>
            <div className="flex items-center" title="Performance Rating">
              <Zap className="h-3.5 w-3.5 mr-1.5 text-blue-500 shrink-0" />
              Performance: <span className="font-semibold ml-1">{provider.performance_rating}%</span>
            </div>
            <div className="flex items-center" title="Renewable Energy">
              <Leaf className="h-3.5 w-3.5 mr-1.5 text-emerald-500 shrink-0" />
              Renewable: <span className="font-semibold ml-1">{provider.renewable_energy_percentage}%</span>
            </div>
            <div className="flex items-center" title="Uptime Guarantee">
              <Shield className="h-3.5 w-3.5 mr-1.5 text-purple-500 shrink-0" />
              Uptime: <span className="font-semibold ml-1">{provider.uptime_guarantee}%</span>
            </div>
          </div>

          <div className="border-t border-slate-200/60 dark:border-slate-700/60 my-2" />

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div className="flex items-center" title="Infrastructure Type">
              {provider.infrastructure_type === "cloud" ? (
                <Cloud className="h-3.5 w-3.5 mr-1.5 text-sky-500 shrink-0" />
              ) : (
                <Server className="h-3.5 w-3.5 mr-1.5 text-slate-500 shrink-0" />
              )}
              Infra: <span className="font-semibold ml-1 capitalize">{provider.infrastructure_type || "N/A"}</span>
            </div>
            <div className="flex items-center" title="CDN Availability">
              <NetworkIcon className="h-3.5 w-3.5 mr-1.5 text-orange-500 shrink-0" />
              CDN: <span className="font-semibold ml-1">{provider.cdn_available ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center" title="SSL Support">
              <Lock className="h-3.5 w-3.5 mr-1.5 text-red-500 shrink-0" />
              SSL: <span className="font-semibold ml-1 capitalize">{provider.ssl_support || "N/A"}</span>
            </div>
            <div className="flex items-center" title="Carbon Neutral">
              <TreePine className="h-3.5 w-3.5 mr-1.5 text-lime-600 shrink-0" />
              Neutral: <span className="font-semibold ml-1">{provider.carbon_neutral ? "Yes" : "No"}</span>
            </div>
          </div>

          {provider.data_center_locations && provider.data_center_locations.length > 0 && (
            <div className="flex items-start text-xs mt-2" title="Data Center Locations">
              <Globe className="h-3.5 w-3.5 mr-1.5 text-cyan-500 shrink-0 mt-0.5" />
              Locations:{" "}
              <span className="ml-1 text-slate-600 dark:text-slate-400 line-clamp-1">
                {provider.data_center_locations.join(", ")}
              </span>
            </div>
          )}
          {provider.green_certifications && provider.green_certifications.length > 0 && (
            <div className="flex items-start text-xs mt-1" title="Green Certifications">
              <Award className="h-3.5 w-3.5 mr-1.5 text-yellow-500 shrink-0 mt-0.5" />
              Certs:{" "}
              <span className="ml-1 text-slate-600 dark:text-slate-400 line-clamp-1">
                {provider.green_certifications.join(", ")}
              </span>
            </div>
          )}
        </CardContent>

        <div className="p-4 pt-3 mt-auto border-t border-slate-100/60 dark:border-slate-800/60 relative z-10">
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              className="flex-1 google-button text-white dark:text-primary-foreground transition-opacity rounded-md" // Changed to google-button
            >
              <Link href={`/hosting/${provider.id}`}>View Details</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary-gradient-middle/30 text-primary-gradient-middle hover:bg-primary-gradient-middle/10 rounded-md"
            >
              <Link href={`/compare?providers=${provider.id}`}>Compare</Link>
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  const renderStars = (rating?: number) => {
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return <span className="text-xs text-muted-foreground">N/A</span>
    }
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5 ? 1 : 0
    const emptyStars = 5 - fullStars - halfStar
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
        {halfStar === 1 && (
          <Star
            key="half"
            className="h-4 w-4 text-yellow-400 fill-yellow-400"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        ))}
      </div>
    )
  }

  const PaginationControls = () => {
    if (totalPages <= 1) return null

    const pageNumbers = []
    const maxPagesToShow = 5
    let startPage, endPage

    if (totalPages <= maxPagesToShow) {
      startPage = 1
      endPage = totalPages
    } else {
      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        startPage = 1
        endPage = maxPagesToShow
      } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1
        endPage = totalPages
      } else {
        startPage = currentPage - Math.floor(maxPagesToShow / 2)
        endPage = currentPage + Math.floor(maxPagesToShow / 2)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          aria-label="Previous Page"
          className="rounded-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {startPage > 1 && (
          <>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} className="rounded-lg">
              1
            </Button>
            {startPage > 2 && <span className="text-muted-foreground">...</span>}
          </>
        )}
        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="icon"
            onClick={() => setCurrentPage(pageNumber)}
            aria-label={`Go to page ${pageNumber}`}
            className={cn("rounded-lg", currentPage === pageNumber && "bg-primary-gradient text-white shimmer")} // Added shimmer
          >
            {pageNumber}
          </Button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-muted-foreground">...</span>}
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} className="rounded-lg">
              {totalPages}
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
          className="rounded-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 page-transition">
      {/* Quick verification - can be removed later */}
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 magic-fade-in">
        {" "}
        {/* Added magic-fade-in */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-4">
            Green Hosting Providers Catalog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-lg">
            Discover hosting providers committed to sustainability. Compare environmental impact, performance, and
            features to make informed decisions for responsible web hosting.
          </p>
        </div>
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl shimmer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Eco-Friendly Options</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Find hosting providers that use renewable energy and implement sustainable practices to reduce carbon
                footprint.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl shimmer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Compare speed, uptime guarantees, and reliability metrics to ensure your website performs at its best.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl shimmer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Security Features</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Evaluate security offerings including SSL certificates, DDoS protection, and backup solutions.
              </p>
            </CardContent>
          </Card>
        </div>
        <HostingFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filterTier={filterTier}
          setFilterTier={setFilterTier}
          totalProviders={STATIC_HOSTING_PROVIDERS.length}
          filteredCount={totalFilteredCount}
          currentPage={currentPage}
          totalPages={totalPages}
        />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8 mt-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary-gradient data-[state=active]:text-white rounded-md data-[state=active]:shadow-lg transition-all"
            >
              All ({STATIC_HOSTING_PROVIDERS.length})
            </TabsTrigger>
            <TabsTrigger
              value="green"
              className="data-[state=active]:bg-primary-gradient data-[state=active]:text-white rounded-md data-[state=active]:shadow-lg transition-all"
            >
              <Leaf className="h-4 w-4 mr-1" />
              Green ({greenProviders.length})
            </TabsTrigger>
            <TabsTrigger
              value="less-green"
              className="data-[state=active]:bg-primary-gradient data-[state=active]:text-white rounded-md data-[state=active]:shadow-lg transition-all"
            >
              Standard ({lessGreenProviders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
            {paginatedProviders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">No hosting providers found matching your criteria.</p>
              </div>
            )}
            <PaginationControls />
          </TabsContent>

          <TabsContent value="green" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
            {paginatedProviders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
                  No green hosting providers found matching your criteria.
                </p>
              </div>
            )}
            <PaginationControls />
          </TabsContent>

          <TabsContent value="less-green" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
            {paginatedProviders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
                  No standard hosting providers found matching your criteria.
                </p>
              </div>
            )}
            <PaginationControls />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect, useMemo } from "react"
import { PlusCircle, XCircle, Star, Leaf, Shield, Globe, Zap, BarChart3, TrendingUp, Award } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { LoadingAnimation } from "@/components/loading-animation"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

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

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [selectedProviders, setSelectedProviders] = useState<HostingProvider[]>([])
  const [allProviders, setAllProviders] = useState<HostingProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showProviderSelector, setShowProviderSelector] = useState(false)

  useEffect(() => {
    fetchProviders()
  }, [])

  useEffect(() => {
    // Check if providers are passed via URL params
    const providersParam = searchParams.get("providers")
    if (providersParam && allProviders.length > 0) {
      const providerIds = providersParam.split(",").map((id) => Number.parseInt(id))
      const preselectedProviders = allProviders.filter((p) => providerIds.includes(p.id))
      setSelectedProviders(preselectedProviders)
    }
  }, [searchParams, allProviders])

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/hosting-providers")
      if (response.ok) {
        const data = await response.json()
        setAllProviders(data)
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

  const filteredProviders = useMemo(() => {
    return allProviders.filter(
      (provider) =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedProviders.some((selected) => selected.id === provider.id),
    )
  }, [allProviders, searchTerm, selectedProviders])

  const addProvider = (provider: HostingProvider) => {
    if (selectedProviders.length < 5) {
      setSelectedProviders([...selectedProviders, provider])
      setSearchTerm("")
      if (selectedProviders.length >= 4) {
        setShowProviderSelector(false)
      }
    } else {
      toast({
        title: "Limit Reached",
        description: "You can compare up to 5 providers at once",
        variant: "destructive",
      })
    }
  }

  const removeProvider = (providerId: number) => {
    setSelectedProviders(selectedProviders.filter((p) => p.id !== providerId))
  }

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "budget":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      case "mid-range":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "enterprise":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 20)
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < stars ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
          />
        ))}
      </div>
    )
  }

  const ComparisonChart = ({ providers }: { providers: HostingProvider[] }) => {
    const metrics = [
      { key: "sustainability_score", label: "Sustainability", color: "bg-green-500" },
      { key: "performance_rating", label: "Performance", color: "bg-blue-500" },
      { key: "renewable_energy_percentage", label: "Renewable Energy", color: "bg-emerald-500" },
      { key: "support_quality", label: "Support Quality", color: "bg-purple-500" },
    ]

    return (
      <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Performance Comparison Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {metrics.map((metric) => (
              <div key={metric.key}>
                <h4 className="font-medium text-sm text-slate-600 dark:text-slate-400 mb-3">{metric.label}</h4>
                <div className="space-y-2">
                  {providers.map((provider) => {
                    const value = provider[metric.key as keyof HostingProvider] as number
                    return (
                      <div key={provider.id} className="flex items-center">
                        <div className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                          {provider.name}
                        </div>
                        <div className="flex-1 mx-3">
                          <Progress value={value} className="h-3" indicatorClassName={metric.color} />
                        </div>
                        <div className="w-12 text-sm font-bold text-right">{value}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-4">
              Compare Hosting Providers
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Select up to 5 hosting providers to compare their features, performance, and sustainability metrics side
              by side.
            </p>
          </div>

          {/* Provider Selection */}
          <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Selected Providers ({selectedProviders.length}/5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                {selectedProviders.map((provider) => (
                  <Badge
                    key={provider.id}
                    variant="outline"
                    className="px-3 py-2 text-sm bg-primary-gradient-start/10 border-primary-gradient-start/30"
                  >
                    {provider.name}
                    <button
                      onClick={() => removeProvider(provider.id)}
                      className="ml-2 hover:text-red-500"
                      aria-label={`Remove ${provider.name}`}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </Badge>
                ))}
              </div>

              {selectedProviders.length < 5 && (
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowProviderSelector(!showProviderSelector)}
                    variant="outline"
                    className="border-primary-gradient-start/30 text-primary-gradient-start hover:bg-primary-gradient-start/10"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Provider to Compare
                  </Button>

                  {showProviderSelector && (
                    <div className="space-y-3">
                      <Input
                        placeholder="Search providers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                        {filteredProviders.slice(0, 12).map((provider) => (
                          <Button
                            key={provider.id}
                            variant="outline"
                            onClick={() => addProvider(provider)}
                            className="justify-start h-auto p-3 text-left"
                          >
                            <div>
                              <div className="font-medium">{provider.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {provider.carbon_neutral && <Leaf className="inline h-3 w-3 mr-1" />}
                                {provider.pricing_tier} • {provider.sustainability_score}% sustainable
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedProviders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select hosting providers to start comparing</p>
                  <p className="text-sm mt-1">
                    <Link href="/hosting" className="text-primary-gradient-start hover:underline">
                      Browse our hosting catalog
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comparison Results */}
          {selectedProviders.length >= 2 && (
            <>
              <ComparisonChart providers={selectedProviders} />

              {/* Detailed Comparison Table */}
              <Card className="mb-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                <CardHeader>
                  <CardTitle>Detailed Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-48 sticky left-0 bg-white dark:bg-slate-900 z-10">Feature</TableHead>
                          {selectedProviders.map((provider) => (
                            <TableHead key={provider.id} className="text-center min-w-48">
                              <div className="space-y-1">
                                <div className="font-semibold">{provider.name}</div>
                                <Badge className={getTierColor(provider.pricing_tier)}>{provider.pricing_tier}</Badge>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center">
                              <Leaf className="h-4 w-4 mr-2 text-green-500" />
                              Sustainability Score
                            </div>
                          </TableCell>
                          {selectedProviders.map((provider) => (
                            <TableCell key={provider.id} className="text-center">
                              <div className={`font-bold text-lg ${getScoreColor(provider.sustainability_score)}`}>
                                {provider.sustainability_score}%
                              </div>
                              <Progress
                                value={provider.sustainability_score}
                                className="h-2 mt-1"
                                indicatorClassName={
                                  provider.sustainability_score >= 80
                                    ? "bg-green-500"
                                    : provider.sustainability_score >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }
                              />
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center">
                              <Zap className="h-4 w-4 mr-2 text-blue-500" />
                              Performance Rating
                            </div>
                          </TableCell>
                          {selectedProviders.map((provider) => (
                            <TableCell key={provider.id} className="text-center">
                              <div className={`font-bold text-lg ${getScoreColor(provider.performance_rating)}`}>
                                {provider.performance_rating}%
                              </div>
                              <Progress
                                value={provider.performance_rating}
                                className="h-2 mt-1"
                                indicatorClassName="bg-blue-500"
                              />
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-2 text-green-500" />
                              Renewable Energy
                            </div>
                          </TableCell>
                          {selectedProviders.map((provider) => (
                            <TableCell key={provider.id} className="text-center">
                              <div className="font-bold text-lg text-green-600 dark:text-green-400">
                                {provider.renewable_energy_percentage}%
                              </div>
                              <Progress
                                value={provider.renewable_energy_percentage}
                                className="h-2 mt-1"
                                indicatorClassName="bg-green-500"
                              />
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center">
                              <Leaf className="h-4 w-4 mr-2 text-green-500" />
                              Carbon Neutral
                            </div>
                          </TableCell>
                          {selectedProviders.map((provider) => (
                            <TableCell key={provider.id} className="text-center">
                              {provider.carbon_neutral ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                  ✓ Yes
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  ✗ No
                                </Badge>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-2 text-yellow-500" />
                              Support Quality
                            </div>
                          </TableCell>
                          {selectedProviders.map((provider) => (
                            <TableCell key={provider.id} className="text-center">
                              <div className="flex flex-col items-center">
                                {renderStars(provider.support_quality)}
                                <span className="text-sm text-muted-foreground mt-1">{provider.support_quality}%</span>
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center">
                              <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                              Uptime Guarantee
                            </div>
                          </TableCell>
                          {selectedProviders.map((provider) => (
                            <TableCell key={provider.id} className="text-center">
                              <div className="font-bold text-lg">{provider.uptime_guarantee}%</div>
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-blue-500" />
                              Security Features
                            </div>
                          </TableCell>
                          {selectedProviders.map((provider) => (
                            <TableCell key={provider.id} className="text-center">
                              <div className="space-y-1">
                                {provider.security_features.slice(0, 3).map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs block">
                                    {feature}
                                  </Badge>
                                ))}
                                {provider.security_features.length > 3 && (
                                  <div className="text-xs text-muted-foreground">
                                    +{provider.security_features.length - 3} more
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-sky-500" />
                              Data Centers
                            </div>
                          </TableCell>
                          {selectedProviders.map((provider) => (
                            <TableCell key={provider.id} className="text-center">
                              <div className="space-y-1">
                                {provider.data_center_locations.slice(0, 3).map((location, index) => (
                                  <Badge key={index} variant="outline" className="text-xs block">
                                    {location}
                                  </Badge>
                                ))}
                                {provider.data_center_locations.length > 3 && (
                                  <div className="text-xs text-muted-foreground">
                                    +{provider.data_center_locations.length - 3} more
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>

                        <TableRow>
                          <TableCell className="font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-2 text-purple-500" />
                              Green Certifications
                            </div>
                          </TableCell>
                          {selectedProviders.map((provider) => (
                            <TableCell key={provider.id} className="text-center">
                              {provider.green_certifications.length > 0 ? (
                                <div className="space-y-1">
                                  {provider.green_certifications.slice(0, 2).map((cert, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs block bg-green-50 dark:bg-green-900/20"
                                    >
                                      {cert}
                                    </Badge>
                                  ))}
                                  {provider.green_certifications.length > 2 && (
                                    <div className="text-xs text-muted-foreground">
                                      +{provider.green_certifications.length - 2} more
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">None</span>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                {selectedProviders.map((provider) => (
                  <Button key={provider.id} asChild className="bg-primary-gradient hover:opacity-90 text-white">
                    <a href={provider.website} target="_blank" rel="noopener noreferrer">
                      Visit {provider.name}
                    </a>
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

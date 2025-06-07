"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, Lightbulb, FileText } from "lucide-react"
import { AiContentStudio } from "@/components/ai-content-studio"
import { SustainabilityChart } from "@/components/sustainability-chart"
import type { WebsiteData } from "@/types/website-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface ResultsSectionProps {
  data: WebsiteData
  isLoading: boolean
  isError: boolean
  onSignUpClick: () => void
}

export function ResultsSection({ data, isLoading, isError, onSignUpClick }: ResultsSectionProps) {
  const searchParams = useSearchParams()
  const [selectedTone, setSelectedTone] = useState(searchParams.get("tone") || "professional")

  useEffect(() => {
    const tone = searchParams.get("tone")
    if (tone) {
      setSelectedTone(tone)
    }
  }, [searchParams])

  if (isLoading) {
    return (
      <section className="container grid items-center justify-center gap-6 pt-20 pb-10">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-[150px]" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-[200px]" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[100%]" />
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-4 w-[50%]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-[150px]" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-[200px]" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[100%]" />
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-4 w-[50%]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-[150px]" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-[200px]" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[100%]" />
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-4 w-[50%]" />
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="container grid items-center justify-center gap-6 pt-20 pb-10">
        <div className="flex flex-col gap-2">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Oops!</h2>
          <p className="text-muted-foreground">Something went wrong. Please try again.</p>
        </div>
      </section>
    )
  }

  if (!data) {
    return null
  }

  return (
    <section className="container grid items-center justify-center gap-6 pt-20 pb-10">
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Here are your results
          </h2>
          <p className="text-muted-foreground">Here&apos;s what we found after analyzing {data.url}.</p>
        </div>
        <Select onValueChange={setSelectedTone} defaultValue={selectedTone}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="humorous">Humorous</SelectItem>
            <SelectItem value="persuasive">Persuasive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="sustainability" className="w-full">
        <TabsList>
          <TabsTrigger value="sustainability">
            <BarChart3 className="mr-2 h-4 w-4" />
            Sustainability
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Lightbulb className="mr-2 h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="content-generation">
            <FileText className="mr-2 h-4 w-4" />
            Content Generation
          </TabsTrigger>
        </TabsList>
        <div className="pt-4">
          <TabsContent value="sustainability" className="space-y-4">
            <SustainabilityChart data={data} />
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Important metrics for your website.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium leading-none">Carbon Footprint</p>
                  <p className="text-5xl font-bold">{data.metrics.carbonFootprint.toFixed(2)}g</p>
                  <p className="text-sm text-muted-foreground">Estimated carbon footprint of your website.</p>
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Page Size</p>
                  <p className="text-5xl font-bold">{data.metrics.pageWeight.toFixed(2)}MB</p>
                  <p className="text-sm text-muted-foreground">Total size of all resources on your website.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content-generation">
            <AiContentStudio analysisId={data._id} tone={selectedTone} onSignUpClick={onSignUpClick} />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  )
}

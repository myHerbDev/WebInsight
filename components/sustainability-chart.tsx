"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { WebsiteData } from "@/types/website-data"

interface SustainabilityChartProps {
  data: WebsiteData | null | undefined
}

export function SustainabilityChart({ data }: SustainabilityChartProps) {
  // If no data is provided, return a placeholder
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sustainability Impact</CardTitle>
          <CardDescription>No data available for sustainability analysis.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Please analyze a website to see sustainability metrics.</p>
        </CardContent>
      </Card>
    )
  }

  // Ensure metrics exist with fallbacks
  const metrics = data.metrics || {
    carbonFootprint: 0,
    pageWeight: 0,
  }

  // Calculate sustainability metrics
  const annualPageViews = 100000
  const annualCO2 = (metrics.carbonFootprint * annualPageViews) / 1000 // kg CO2 per year
  const treesNeeded = annualCO2 / 21 // Each tree absorbs ~21kg CO2 per year
  const paperSheets = annualCO2 * 100 // Sheets of paper equivalent

  // Prepare chart data
  const chartData = [
    {
      name: "Current",
      CO2: metrics.carbonFootprint,
      Trees: treesNeeded / 1000, // Convert to a smaller unit for visualization
      Paper: paperSheets / 10000, // Convert to a smaller unit for visualization
    },
    {
      name: "Optimized",
      CO2: metrics.carbonFootprint * 0.7, // 30% reduction
      Trees: (treesNeeded * 0.7) / 1000,
      Paper: (paperSheets * 0.7) / 10000,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sustainability Impact</CardTitle>
        <CardDescription>Environmental impact of your website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 md:grid-cols-3 mb-6">
          <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg border border-green-100">
            <span className="text-sm font-medium text-green-800 mb-1">Annual CO2</span>
            <span className="text-3xl font-bold text-green-700">{annualCO2.toFixed(2)} kg</span>
            <span className="text-xs text-green-600 mt-1">Based on {annualPageViews.toLocaleString()} page views</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg border border-green-100">
            <span className="text-sm font-medium text-green-800 mb-1">Trees Needed</span>
            <span className="text-3xl font-bold text-green-700">{treesNeeded.toFixed(2)}</span>
            <span className="text-xs text-green-600 mt-1">To offset annual carbon emissions</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg border border-green-100">
            <span className="text-sm font-medium text-green-800 mb-1">Paper Equivalent</span>
            <span className="text-3xl font-bold text-green-700">{Math.round(paperSheets).toLocaleString()}</span>
            <span className="text-xs text-green-600 mt-1">Sheets of paper</span>
          </div>
        </div>

        <ChartContainer
          config={{
            CO2: {
              label: "CO2 Emissions (g)",
              color: "hsl(var(--chart-1))",
            },
            Trees: {
              label: "Trees Needed (x1000)",
              color: "hsl(var(--chart-2))",
            },
            Paper: {
              label: "Paper Sheets (x10,000)",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="CO2" fill="var(--color-CO2)" />
              <Bar dataKey="Trees" fill="var(--color-Trees)" />
              <Bar dataKey="Paper" fill="var(--color-Paper)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
          <h4 className="font-medium text-green-800 mb-2">Optimization Recommendations</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              <span className="text-green-700">Optimize images to reduce page weight</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              <span className="text-green-700">Minimize JavaScript and CSS files</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              <span className="text-green-700">Use efficient hosting providers with renewable energy</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

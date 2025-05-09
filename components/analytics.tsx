"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WebsiteData } from "@/types/website-data"
import { Progress } from "@/components/ui/progress"

interface AnalyticsProps {
  data: WebsiteData
}

export function Analytics({ data }: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sustainability Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.sustainability.score}%</div>
          <Progress value={data.sustainability.score} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.sustainability.performance}%</div>
          <Progress value={data.sustainability.performance} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Content Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <Progress value={85} className="h-2 mt-2" />
        </CardContent>
      </Card>
    </div>
  )
}

"use client"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from "recharts"
import type { WebsiteData } from "@/types/website-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Zap, Shield, FileText, Accessibility, Smartphone } from "lucide-react"

interface SustainabilityChartProps {
  data: WebsiteData
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "#22c55e" // green-500
  if (score >= 60) return "#f59e0b" // amber-500
  return "#ef4444" // red-500
}

export function SustainabilityChart({ data }: SustainabilityChartProps) {
  const chartData = [
    {
      name: "Sustainability",
      score: data.sustainability_score || data.sustainability?.score || 0,
      icon: Leaf,
      fill: getScoreColor(data.sustainability_score || data.sustainability?.score || 0),
    },
    {
      name: "Performance",
      score: data.performance_score || 0,
      icon: Zap,
      fill: getScoreColor(data.performance_score || 0),
    },
    { name: "Security", score: data.security_score || 0, icon: Shield, fill: getScoreColor(data.security_score || 0) },
    {
      name: "Content Quality",
      score: data.content_quality_score || 0,
      icon: FileText,
      fill: getScoreColor(data.content_quality_score || 0),
    },
    {
      name: "Accessibility",
      score: data.accessibility_score || 0,
      icon: Accessibility,
      fill: getScoreColor(data.accessibility_score || 0),
    },
    {
      name: "Mobile Friendly",
      score: data.mobile_friendliness_score || 0,
      icon: Smartphone,
      fill: getScoreColor(data.mobile_friendliness_score || 0),
    },
  ].filter((item) => typeof item.score === "number" && item.score > 0) // Filter out zero/undefined scores for cleaner chart

  if (chartData.length === 0) {
    return <p className="text-center text-muted-foreground">No detailed scores available for chart.</p>
  }

  return (
    <Card className="dark:bg-slate-700/50">
      <CardHeader>
        <CardTitle>Overall Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`${value}%`, "Score"]}
              />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {data.improvements && data.improvements.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Key Improvement Areas:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {data.improvements.slice(0, 5).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

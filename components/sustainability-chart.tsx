"use client"

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts"

interface SustainabilityChartProps {
  performance: number
  scriptOptimization: number
  contentQuality: number
  security: number
}

export function SustainabilityChart({
  performance,
  scriptOptimization,
  contentQuality,
  security,
}: SustainabilityChartProps) {
  const data = [
    {
      subject: "Performance",
      score: performance,
      fullMark: 100,
    },
    {
      subject: "Script Optimization",
      score: scriptOptimization,
      fullMark: 100,
    },
    {
      subject: "Content Quality",
      score: contentQuality,
      fullMark: 100,
    },
    {
      subject: "Security",
      score: security,
      fullMark: 100,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}

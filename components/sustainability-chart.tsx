"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SustainabilityChartProps {
  data: {
    score: number
    performance: number
    scriptOptimization: number
    duplicateContent: number
  }
}

export function SustainabilityChart({ data }: SustainabilityChartProps) {
  const chartData = [
    {
      name: "Performance",
      value: data.performance,
      fill: "#8b5cf6",
    },
    {
      name: "Script Optimization",
      value: data.scriptOptimization,
      fill: "#14b8a6",
    },
    {
      name: "Duplicate Content",
      value: data.duplicateContent,
      fill: "#6366f1",
    },
    {
      name: "Overall Score",
      value: data.score,
      fill: "#ec4899",
    },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="Score (%)" />
      </BarChart>
    </ResponsiveContainer>
  )
}

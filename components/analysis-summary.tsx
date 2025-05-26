"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StatusIndicator } from "@/components/status-indicator"
import type { WebsiteData } from "@/types/website-data"
import { Globe, ImageIcon, FileText, Clock } from "lucide-react"

interface AnalysisSummaryProps {
  data: WebsiteData
}

export function AnalysisSummary({ data }: AnalysisSummaryProps) {
  const getScoreStatus = (score: number) => {
    if (score >= 80) return "success"
    if (score >= 60) return "warning"
    return "error"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Analysis Summary</span>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Website Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Website Details
            </h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>Title:</strong> {data.title}
              </p>
              <p>
                <strong>URL:</strong> {data.url}
              </p>
              <p>
                <strong>Keywords:</strong> {data.keywords.slice(0, 5).join(", ")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Content Overview
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Words:</span>
                <span className="font-medium">{data.contentStats.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Images:</span>
                <span className="font-medium">{data.contentStats.images}</span>
              </div>
              <div className="flex justify-between">
                <span>Headings:</span>
                <span className="font-medium">{data.contentStats.headings}</span>
              </div>
              <div className="flex justify-between">
                <span>Links:</span>
                <span className="font-medium">{data.contentStats.links}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Scores */}
        <div className="space-y-4">
          <h4 className="font-medium">Performance Metrics</h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Overall Sustainability</span>
                <StatusIndicator
                  status={getScoreStatus(data.sustainability.score)}
                  message={`${data.sustainability.score}% - ${getScoreMessage(data.sustainability.score)}`}
                />
              </div>
              <Progress value={data.sustainability.score} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Performance</span>
                <StatusIndicator
                  status={getScoreStatus(data.sustainability.performance)}
                  message={`${data.sustainability.performance}%`}
                />
              </div>
              <Progress value={data.sustainability.performance} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Script Optimization</span>
                <StatusIndicator
                  status={getScoreStatus(data.sustainability.scriptOptimization)}
                  message={`${data.sustainability.scriptOptimization}%`}
                />
              </div>
              <Progress value={data.sustainability.scriptOptimization} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Content Quality</span>
                <StatusIndicator
                  status={getScoreStatus(data.sustainability.duplicateContent)}
                  message={`${data.sustainability.duplicateContent}%`}
                />
              </div>
              <Progress value={data.sustainability.duplicateContent} className="h-2" />
            </div>
          </div>
        </div>

        {/* Top Recommendations */}
        <div className="space-y-2">
          <h4 className="font-medium">Top Recommendations</h4>
          <div className="space-y-2">
            {data.sustainability.improvements.slice(0, 3).map((improvement, index) => (
              <div key={index} className="flex items-start p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs font-medium mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm">{improvement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Screenshot Status */}
        {data.screenshotUrl && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              Screenshot
            </h4>
            <StatusIndicator
              status="success"
              message="Screenshot captured successfully"
              details="Available in Screenshot tab"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"

type ResultsSectionProps = { data?: any }

export function ResultsSection({ data }: ResultsSectionProps) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <div className="flex justify-end space-x-2">
        <Button
          onClick={() => window.open("/ai-content", "_blank")}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Brain className="w-4 h-4 mr-2" />
          Generate AI Content
        </Button>
      </div>
      {/* Add your results display logic here */}
      <p>Results will be displayed here.</p>
    </div>
  )
}

export default ResultsSection

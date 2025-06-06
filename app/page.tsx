"use client"

import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import ResultsSection from "@/components/ResultsSection"

export default function Home() {
  const [url, setUrl] = useState("")
  const [analysisData, setAnalysisData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async (url: string) => {
    if (!url.trim()) {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)
    setError(null)
    setAnalysisData(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Network error" }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Validate that we received valid data
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response data")
      }

      // Ensure required fields exist
      const validatedData = {
        url: url.trim(),
        title: data.title || url.trim(),
        ...data,
      }

      setAnalysisData(validatedData)
    } catch (err) {
      console.error("Analysis error:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze website")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 py-12 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-gray-800 mb-8"
      >
        Website Analyzer
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter website URL"
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => handleAnalyze(url)}
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      </motion.div>

      {analysisData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <Suspense fallback={<div className="text-center py-8">Loading results...</div>}>
            <ResultsSection data={analysisData} />
          </Suspense>
        </motion.div>
      )}
    </div>
  )
}

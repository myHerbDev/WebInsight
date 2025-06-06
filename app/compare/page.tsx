"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { PlusCircle, XCircle } from "lucide-react"

export default function ComparePage() {
  const [urlsToCompare, setUrlsToCompare] = useState<string[]>(["", ""])

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urlsToCompare]
    newUrls[index] = value
    setUrlsToCompare(newUrls)
  }

  const addUrlInput = () => {
    if (urlsToCompare.length < 5) {
      // Limit to 5 URLs for comparison
      setUrlsToCompare([...urlsToCompare, ""])
    }
  }

  const removeUrlInput = (index: number) => {
    if (urlsToCompare.length > 2) {
      // Keep at least 2 inputs
      const newUrls = urlsToCompare.filter((_, i) => i !== index)
      setUrlsToCompare(newUrls)
    }
  }

  const handleCompare = () => {
    // TODO: Implement comparison logic
    // Fetch analysis for each URL and display side-by-side
    alert(
      "Comparison feature coming soon! URLs to compare: " + urlsToCompare.filter((url) => url.trim() !== "").join(", "),
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-2 text-slate-800 dark:text-slate-200">
            Compare Websites
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8 text-sm sm:text-base">
            Enter up to 5 website URLs to compare their analysis side-by-side.
          </p>

          <div className="space-y-4 mb-6">
            {urlsToCompare.map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="url"
                  placeholder={`Website URL ${index + 1}`}
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="h-11 border-slate-300 dark:border-slate-700 focus:ring-brand-DEFAULT"
                />
                {urlsToCompare.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUrlInput(index)}
                    aria-label="Remove URL input"
                  >
                    <XCircle className="h-5 w-5 text-slate-500 hover:text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
            <Button
              variant="outline"
              onClick={addUrlInput}
              disabled={urlsToCompare.length >= 5}
              className="w-full sm:w-auto border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Another URL
            </Button>
            <Button
              onClick={handleCompare}
              className="w-full sm:w-auto bg-brand-DEFAULT hover:bg-brand-dark text-white"
              disabled={urlsToCompare.filter((url) => url.trim() !== "").length < 2}
            >
              Compare Websites
            </Button>
          </div>

          {/* Placeholder for comparison results */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <p className="text-center text-slate-500 dark:text-slate-400">
              Comparison results will be displayed here. This feature is under development.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

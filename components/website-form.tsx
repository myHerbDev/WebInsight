"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkIcon } from "lucide-react"

interface WebsiteFormProps {
  onSubmit: (url: string) => void
}

export function WebsiteForm({ onSubmit }: WebsiteFormProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      // Add http:// if not present
      let formattedUrl = url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        formattedUrl = `https://${url}`
      }
      onSubmit(formattedUrl)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-center mb-6">Analyze Any Website</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        Get key insights, content analysis, and sustainability metrics for any website
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter website URL (e.g., example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium rounded-lg"
        >
          Analyze Website
        </Button>
      </form>
    </div>
  )
}

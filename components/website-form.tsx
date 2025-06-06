"use client"

import type React from "react"
import { useState } from "react"

interface WebsiteFormProps {
  onAnalyze: (url: string) => void
}

const WebsiteForm: React.FC<WebsiteFormProps> = ({ onAnalyze }) => {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAnalyze(url)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
      <input
        type="url"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 text-base px-4 py-3 border-0 bg-transparent placeholder:text-muted-foreground focus:outline-none search-focus"
        required
      />
      <button
        type="submit"
        className="google-button text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 card-hover-lift"
      >
        Analyze
      </button>
    </form>
  )
}

export default WebsiteForm

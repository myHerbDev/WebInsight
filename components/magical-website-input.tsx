"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, X } from "lucide-react"
import { motion } from "framer-motion"

interface MagicalWebsiteInputProps {
  onAnalyze: (url: string) => void
  isAnalyzing: boolean
  error: string | null
}

export function MagicalWebsiteInput({ onAnalyze, isAnalyzing, error }: MagicalWebsiteInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isAnalyzing) {
      onAnalyze(inputValue.trim())
    }
  }

  const handleClear = () => {
    setInputValue("")
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter website URL (e.g., example.com)"
            className="pl-10 pr-12 py-6 text-lg rounded-full shadow-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isAnalyzing}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          {inputValue && !isAnalyzing && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-12 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <Button
          type="submit"
          disabled={!inputValue.trim() || isAnalyzing}
          className="absolute right-1 top-1 bottom-1 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </Button>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-red-500 text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        Try analyzing your website to get insights on performance, sustainability, and security.
      </div>
    </div>
  )
}

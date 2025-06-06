"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppDiagnostics } from "@/components/app-diagnostics"
import { MagicalWebsiteInput } from "@/components/magical-website-input"
import { Logo } from "@/components/logo"

export default function TestPage() {
  const [inputValue, setInputValue] = useState("")
  const [testResults, setTestResults] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const addTestResult = (result: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testBasicInput = () => {
    if (inputValue.trim()) {
      addTestResult(`✅ Basic input working - Value: "${inputValue}"`)
    } else {
      addTestResult("❌ Basic input test failed - No value entered")
    }
  }

  const testMagicalInput = async (url: string) => {
    setIsAnalyzing(true)
    addTestResult(`🔄 Testing magical input with URL: ${url}`)

    try {
      // Simulate the analysis process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      addTestResult(`✅ Magical input component working correctly`)
    } catch (error) {
      addTestResult(`❌ Magical input test failed: ${error}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <Logo size="lg" />
        <h1 className="text-3xl font-bold mt-4">Application Test Page</h1>
        <p className="text-gray-600 mt-2">Verify that all components are working correctly</p>
      </div>

      {/* Diagnostics Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">System Diagnostics</h2>
        <AppDiagnostics />
      </section>

      {/* Basic Input Test */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Basic Input Test</h2>
        <Card>
          <CardHeader>
            <CardTitle>Test Basic Form Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter any text to test input functionality"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={testBasicInput}>Test Input</Button>
            </div>
            <div className="text-sm text-gray-600">Current value: "{inputValue}"</div>
          </CardContent>
        </Card>
      </section>

      {/* Magical Input Test */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Website Input Component Test</h2>
        <Card>
          <CardHeader>
            <CardTitle>Test MagicalWebsiteInput Component</CardTitle>
          </CardHeader>
          <CardContent>
            <MagicalWebsiteInput onAnalyze={testMagicalInput} isAnalyzing={isAnalyzing} error={null} />
          </CardContent>
        </Card>
      </section>

      {/* Test Results */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Test Log</span>
              <Button onClick={clearResults} variant="outline" size="sm">
                Clear Results
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No test results yet. Try the tests above.</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Navigation */}
      <div className="text-center">
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          Back to Home Page
        </Button>
      </div>
    </div>
  )
}

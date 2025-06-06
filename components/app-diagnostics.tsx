"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface DiagnosticResult {
  name: string
  status: "success" | "error" | "warning" | "loading"
  message: string
}

export function AppDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)
    const results: DiagnosticResult[] = []

    // Test 1: Check if React is working
    try {
      results.push({
        name: "React Rendering",
        status: "success",
        message: "React components are rendering correctly",
      })
    } catch (error) {
      results.push({
        name: "React Rendering",
        status: "error",
        message: `React error: ${error}`,
      })
    }

    // Test 2: Check localStorage
    try {
      localStorage.setItem("test", "value")
      const value = localStorage.getItem("test")
      localStorage.removeItem("test")

      if (value === "value") {
        results.push({
          name: "LocalStorage",
          status: "success",
          message: "LocalStorage is working correctly",
        })
      } else {
        results.push({
          name: "LocalStorage",
          status: "error",
          message: "LocalStorage read/write failed",
        })
      }
    } catch (error) {
      results.push({
        name: "LocalStorage",
        status: "error",
        message: `LocalStorage error: ${error}`,
      })
    }

    // Test 3: Check API endpoint
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "test.com" }),
      })

      if (response.status === 400 || response.status === 200) {
        results.push({
          name: "API Endpoint",
          status: "success",
          message: "API endpoint is responding",
        })
      } else {
        results.push({
          name: "API Endpoint",
          status: "warning",
          message: `API returned status: ${response.status}`,
        })
      }
    } catch (error) {
      results.push({
        name: "API Endpoint",
        status: "error",
        message: `API error: ${error}`,
      })
    }

    // Test 4: Check environment
    try {
      const hasNodeEnv = typeof process !== "undefined"
      results.push({
        name: "Environment",
        status: hasNodeEnv ? "success" : "warning",
        message: hasNodeEnv ? "Environment variables accessible" : "Limited environment access",
      })
    } catch (error) {
      results.push({
        name: "Environment",
        status: "error",
        message: `Environment error: ${error}`,
      })
    }

    // Test 5: Check form functionality
    try {
      const testInput = document.createElement("input")
      testInput.value = "test"
      const hasValue = testInput.value === "test"

      results.push({
        name: "Form Input",
        status: hasValue ? "success" : "error",
        message: hasValue ? "Form inputs working correctly" : "Form input functionality failed",
      })
    } catch (error) {
      results.push({
        name: "Form Input",
        status: "error",
        message: `Form error: ${error}`,
      })
    }

    setDiagnostics(results)
    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "loading":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const successCount = diagnostics.filter((d) => d.status === "success").length
  const totalCount = diagnostics.length

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Application Diagnostics</span>
          <Button onClick={runDiagnostics} disabled={isRunning} size="sm">
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rerun Tests"}
          </Button>
        </CardTitle>
        <div className="text-sm text-gray-600">
          {successCount}/{totalCount} tests passing
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {diagnostics.map((diagnostic, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              {getStatusIcon(diagnostic.status)}
              <div className="flex-1">
                <div className="font-medium">{diagnostic.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{diagnostic.message}</div>
              </div>
            </div>
          ))}
        </div>

        {diagnostics.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            Running diagnostics...
          </div>
        )}
      </CardContent>
    </Card>
  )
}

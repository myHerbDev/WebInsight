import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Code, Globe, Shield, Zap, Info, AlertTriangle } from "lucide-react"

export default function APIReferencePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">API Reference</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Complete reference for the WebInsight API. All endpoints return JSON responses and use standard HTTP status
          codes.
        </p>
      </div>

      {/* API Overview */}
      <Card>
        <CardHeader>
          <CardTitle>API Overview</CardTitle>
          <CardDescription>Base URL, authentication, and general information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Base URL</h3>
            <code className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-sm">https://your-domain.com/api</code>
          </div>

          <div>
            <h3 className="font-medium mb-2">Content Type</h3>
            <code className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-sm">application/json</code>
          </div>

          <div>
            <h3 className="font-medium mb-2">Rate Limits</h3>
            <ul className="text-sm space-y-1">
              <li>
                • <strong>Analysis:</strong> 10 requests per minute
              </li>
              <li>
                • <strong>Content Generation:</strong> 5 requests per minute
              </li>
              <li>
                • <strong>Other endpoints:</strong> 60 requests per minute
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>
            Currently, the API is open for public use. Authentication will be required for premium features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No authentication is currently required for basic API access. Premium features and higher rate limits will
              require API keys in future versions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Endpoints</h2>

        {/* Website Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <CardTitle>Website Analysis</CardTitle>
            </div>
            <CardDescription>Analyze any website for performance, security, and sustainability metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request">
              <TabsList>
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="request" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>POST</Badge>
                  <code>/api/analyze</code>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Request Body</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`{
  "url": "https://example.com",
  "userId": "optional-user-id"
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Parameters</h4>
                  <div className="space-y-2">
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm">url</code>
                        <Badge variant="destructive" className="text-xs">
                          required
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          string
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        The website URL to analyze. Can include or exclude protocol (http/https).
                      </p>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm">userId</code>
                        <Badge variant="secondary" className="text-xs">
                          optional
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          string
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        User ID for associating the analysis with a user account.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="response" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Success Response (200)</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`{
  "_id": "analysis-id",
  "url": "https://example.com",
  "title": "Example Website",
  "summary": "Website description and summary",
  "keyPoints": [
    "Key finding 1",
    "Key finding 2"
  ],
  "keywords": ["keyword1", "keyword2"],
  "sustainability_score": 85,
  "performance_score": 78,
  "security_score": 92,
  "content_quality_score": 88,
  "ssl_certificate": true,
  "security_headers": {
    "strict-transport-security": "max-age=31536000",
    "content-security-policy": "default-src 'self'"
  },
  "hosting_provider_name": "Green Hosting Co",
  "server_location": "US East",
  "ip_address": "192.168.1.1",
  "improvements": [
    "Optimize image sizes",
    "Enable compression"
  ],
  "contentStats": {
    "wordCount": 1250,
    "paragraphs": 15,
    "headings": 8,
    "images": 12,
    "links": 25
  },
  "created_at": "2024-01-15T10:30:00Z"
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Error Response (400/500)</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`{
  "error": "Invalid URL format",
  "message": "Please provide a valid website URL",
  "details": "URL must be in format: https://example.com"
}`}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">JavaScript (fetch)</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com',
    userId: 'user-123'
  })
});

const data = await response.json();
console.log(data);`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Python (requests)</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`import requests

url = "https://your-domain.com/api/analyze"
payload = {
    "url": "https://example.com",
    "userId": "user-123"
}

response = requests.post(url, json=payload)
data = response.json()
print(data)`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Go</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type AnalyzeRequest struct {
    URL    string \`json:"url"\`
    UserID string \`json:"userId,omitempty"\`
}

func main() {
    payload := AnalyzeRequest{
        URL:    "https://example.com",
        UserID: "user-123",
    }
    
    jsonData, _ := json.Marshal(payload)
    
    resp, err := http.Post(
        "https://your-domain.com/api/analyze",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    defer resp.Body.Close()
    
    // Handle response...
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">cURL</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`curl -X POST https://your-domain.com/api/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "userId": "user-123"
  }'`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Content Generation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-500" />
              <CardTitle>AI Content Generation</CardTitle>
            </div>
            <CardDescription>Generate various types of content based on website analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request">
              <TabsList>
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="request" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>POST</Badge>
                  <code>/api/generate-content</code>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Request Body</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`{
  "analysisId": "analysis-id",
  "contentType": "research",
  "tone": "professional"
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Parameters</h4>
                  <div className="space-y-2">
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm">analysisId</code>
                        <Badge variant="destructive" className="text-xs">
                          required
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          string
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        The ID of the website analysis to generate content for.
                      </p>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm">contentType</code>
                        <Badge variant="destructive" className="text-xs">
                          required
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          enum
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Type of content to generate: <code>research</code>, <code>blog</code>, <code>marketing</code>,{" "}
                        <code>social</code>, <code>document</code>
                      </p>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm">tone</code>
                        <Badge variant="secondary" className="text-xs">
                          optional
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          enum
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Content tone: <code>professional</code>, <code>casual</code>, <code>enthusiastic</code>,{" "}
                        <code>technical</code>, <code>friendly</code>
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="response" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Success Response (200)</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`{
  "content": "# Research Report: Example Website\\n\\n## Executive Summary\\n...",
  "contentId": "content-id",
  "success": true,
  "message": "Content generated successfully"
}`}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">JavaScript Example</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`const response = await fetch('/api/generate-content', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    analysisId: 'analysis-123',
    contentType: 'research',
    tone: 'professional'
  })
});

const data = await response.json();
console.log(data.content);`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Hosting Providers */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              <CardTitle>Hosting Providers</CardTitle>
            </div>
            <CardDescription>
              Get information about green hosting providers and their sustainability metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request">
              <TabsList>
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="request" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>GET</Badge>
                  <code>/api/hosting-providers</code>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Query Parameters</h4>
                  <div className="space-y-2">
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm">tier</code>
                        <Badge variant="secondary" className="text-xs">
                          optional
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          string
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Filter by pricing tier: <code>budget</code>, <code>mid-range</code>, <code>premium</code>,{" "}
                        <code>enterprise</code>
                      </p>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm">green_only</code>
                        <Badge variant="secondary" className="text-xs">
                          optional
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          boolean
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Show only carbon neutral providers when set to <code>true</code>
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="response" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Success Response (200)</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`[
  {
    "id": 1,
    "name": "GreenGeeks",
    "website": "https://www.greengeeks.com",
    "sustainability_score": 95,
    "renewable_energy_percentage": 300,
    "carbon_neutral": true,
    "green_certifications": [
      "EPA Green Power Partner",
      "Renewable Energy Certificates"
    ],
    "data_center_locations": ["USA", "Canada", "Netherlands"],
    "pricing_tier": "mid-range",
    "performance_rating": 90,
    "security_features": [
      "Free SSL",
      "DDoS Protection",
      "Daily Backups"
    ],
    "uptime_guarantee": 99.9,
    "support_quality": 85
  }
]`}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">JavaScript Example</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`// Get all hosting providers
const response = await fetch('/api/hosting-providers');
const providers = await response.json();

// Get only green hosting providers
const greenResponse = await fetch('/api/hosting-providers?green_only=true');
const greenProviders = await greenResponse.json();

// Filter by pricing tier
const budgetResponse = await fetch('/api/hosting-providers?tier=budget');
const budgetProviders = await budgetResponse.json();`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <CardTitle>Export Analysis</CardTitle>
            </div>
            <CardDescription>Export analysis results in various formats (PDF, CSV, Markdown)</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request">
              <TabsList>
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="request" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>POST</Badge>
                  <code>/api/export</code>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Request Body</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`{
  "analysisId": "analysis-id",
  "format": "pdf",
  "includeScreenshot": false
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Parameters</h4>
                  <div className="space-y-2">
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm">analysisId</code>
                        <Badge variant="destructive" className="text-xs">
                          required
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          string
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">The ID of the analysis to export.</p>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm">format</code>
                        <Badge variant="destructive" className="text-xs">
                          required
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          enum
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Export format: <code>pdf</code>, <code>markdown</code>, <code>plain</code>
                      </p>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm">includeScreenshot</code>
                        <Badge variant="secondary" className="text-xs">
                          optional
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          boolean
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Include website screenshot in the export (premium feature).
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="response" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Success Response (200)</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`{
  "content": "<!DOCTYPE html>...",
  "title": "Analysis of Example Website",
  "websiteTitle": "Example Website",
  "websiteUrl": "https://example.com",
  "format": "pdf"
}`}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">JavaScript Example</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                    {`const response = await fetch('/api/export', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    analysisId: 'analysis-123',
    format: 'pdf',
    includeScreenshot: false
  })
});

const data = await response.json();

// Create downloadable file
const blob = new Blob([data.content], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = \`\${data.websiteTitle}_report.html\`;
a.click();`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Error Codes */}
      <Card>
        <CardHeader>
          <CardTitle>HTTP Status Codes</CardTitle>
          <CardDescription>Standard HTTP status codes used by the API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Success Codes</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">200</Badge>
                  <span>OK - Request successful</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">201</Badge>
                  <span>Created - Resource created</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Error Codes</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">400</Badge>
                  <span>Bad Request - Invalid parameters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">404</Badge>
                  <span>Not Found - Resource not found</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">429</Badge>
                  <span>Too Many Requests - Rate limit exceeded</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">500</Badge>
                  <span>Internal Server Error</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limiting</CardTitle>
          <CardDescription>Information about API rate limits and headers</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Rate limits are enforced per IP address. When exceeded, the API returns a 429 status code with retry
              information.
            </AlertDescription>
          </Alert>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Rate Limit Headers</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
              {`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
Retry-After: 60`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

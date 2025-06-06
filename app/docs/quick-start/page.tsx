import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Globe, BarChart3, Shield, ArrowRight, Play, ExternalLink, Info } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function QuickStartPage() {
  return (
    <div className="space-y-8">
      {/* Header with Logo */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <Logo size="lg" showText={true} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
          Quick Start Guide
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get up and running with WebInSight in just a few minutes. Analyze your first website and unlock powerful
          insights.
        </p>
      </div>

      {/* Step by Step Guide */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🚀 Get Started in 3 Easy Steps</h2>

        {/* Step 1 */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-white dark:from-purple-950 dark:to-gray-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <CardTitle className="text-xl">Enter Your Website URL</CardTitle>
            </div>
            <CardDescription>Start by analyzing any website with our powerful analysis engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Navigate to the home page and enter any website URL in the analysis form:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded border font-mono text-sm">
                https://example.com
              </div>
              <div className="mt-3">
                <Link href="/">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Play className="h-4 w-4 mr-2" />
                    Try Now
                  </Button>
                </Link>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Pro tip:</strong> You can analyze any public website including competitors, your own sites, or
                websites you're considering for hosting.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-white dark:from-teal-950 dark:to-gray-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <CardTitle className="text-xl">Review Your Analysis Results</CardTitle>
            </div>
            <CardDescription>Understand the comprehensive metrics and insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-500" />
                  Sustainability Score
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Measures environmental impact, renewable energy usage, and carbon footprint
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Performance Metrics
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Loading speed, optimization level, and user experience indicators
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Security Assessment
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  SSL certificates, security headers, and vulnerability checks
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  Content Quality
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  SEO optimization, content structure, and keyword analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <CardTitle className="text-xl">Generate AI-Powered Content</CardTitle>
            </div>
            <CardDescription>Create professional reports, blog posts, and marketing content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Available Content Types:</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  { name: "Research Report", icon: "📊" },
                  { name: "Blog Post", icon: "📝" },
                  { name: "Marketing Content", icon: "📈" },
                  { name: "Social Media", icon: "📱" },
                  { name: "Documentation", icon: "📋" },
                ].map((type, index) => (
                  <Badge key={index} variant="outline" className="justify-center p-2">
                    <span className="mr-1">{type.icon}</span>
                    <span className="text-xs">{type.name}</span>
                  </Badge>
                ))}
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All generated content is automatically saved and can be exported in beautiful formats including HTML,
                Markdown, and PDF.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🎯 Advanced Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Website Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Compare multiple websites side-by-side to identify performance gaps and opportunities.
              </p>
              <Link href="/compare">
                <Button variant="outline" size="sm">
                  Try Comparison Tool
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Green Hosting Catalog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Discover eco-friendly hosting providers and make sustainable choices for your websites.
              </p>
              <Link href="/hosting">
                <Button variant="outline" size="sm">
                  Browse Providers
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Common Issues */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">❓ Common Questions</h2>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How accurate are the analysis results?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Our analysis engine uses multiple data sources and industry-standard metrics to provide highly accurate
                results. Sustainability scores are based on real energy consumption data, performance metrics use
                standardized testing, and security assessments follow OWASP guidelines.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I analyze private or password-protected websites?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Currently, WebInSight can only analyze publicly accessible websites. For private sites, consider
                creating a staging environment or contact us about enterprise solutions that support authenticated
                analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How is the AI content generated?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI uses advanced language models trained on website analysis data to generate contextual, relevant
                content based on your specific analysis results. Each piece of content is unique and tailored to your
                website's metrics and findings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">🎉 Ready to Get Started?</CardTitle>
          <CardDescription className="text-purple-100">
            You're all set to analyze websites and generate amazing content!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Play className="h-5 w-5 mr-2" />
                Analyze Your First Website
              </Button>
            </Link>
            <Link href="/docs/api">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <ExternalLink className="h-5 w-5 mr-2" />
                View API Documentation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

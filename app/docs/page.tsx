import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  Zap,
  Shield,
  Globe,
  BarChart3,
  FileText,
  ArrowRight,
  CheckCircle,
  Star,
  HelpCircle,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { AnalyticsGraphic } from "@/components/analytics-graphic"

export default function DocsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
          WebInsight Documentation
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Comprehensive website analysis platform for performance, sustainability, and security optimization. Get
          started with our powerful API and tools.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Button asChild size="lg">
            <Link href="/docs/quick-start">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/docs/api">API Reference</Link>
          </Button>
        </div>
      </div>

      {/* Login Banner */}
      <div className="relative overflow-hidden rounded-lg border bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/30 dark:to-teal-950/30 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-purple-500 text-white">
              <Lock className="mr-1 h-3 w-3" /> Premium Feature
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Login to save, export, and compare your results</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create a free account to save your website analyses, export detailed reports, and compare multiple
              websites side by side. Unlock the full potential of WebInsight with a user account.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700">
                Create Account
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
          <div className="relative">
            <AnalyticsGraphic className="w-full max-w-md mx-auto" />
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Website Analysis</CardTitle>
            </div>
            <CardDescription>
              Comprehensive analysis of website performance, content, and technical metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Performance scoring
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Content analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                SEO insights
              </li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/docs/api/analyze">Learn More</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Security Assessment</CardTitle>
            </div>
            <CardDescription>Advanced security analysis with SSL, headers, and vulnerability checks</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                SSL certificate validation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Security headers analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Vulnerability scanning
              </li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/docs/guides/security">Learn More</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Sustainability Metrics</CardTitle>
            </div>
            <CardDescription>Environmental impact analysis and green hosting recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Carbon footprint analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Green hosting detection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Optimization recommendations
              </li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/docs/guides/sustainability">Learn More</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal-500" />
              <CardTitle className="text-lg">Hosting Analysis</CardTitle>
            </div>
            <CardDescription>Comprehensive hosting provider analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Provider identification
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Sustainability ratings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Performance metrics
              </li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/docs/api/hosting">Learn More</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-lg">AI Content Generation</CardTitle>
            </div>
            <CardDescription>Generate research reports, blog posts, and marketing content using AI</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Research reports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Blog content
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Social media posts
              </li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/docs/api/generate">Learn More</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">Export & Sharing</CardTitle>
            </div>
            <CardDescription>Export analysis results in multiple formats and share across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                PDF reports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                CSV exports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Social sharing
              </li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/docs/api/export">Learn More</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20">
        <CardHeader>
          <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
          <CardDescription>Get up and running with WebInsight in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">1</span>
              </div>
              <h3 className="font-medium mb-2">Analyze a Website</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter any website URL to get comprehensive analysis results
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-teal-600 dark:text-teal-400">2</span>
              </div>
              <h3 className="font-medium mb-2">Review Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Explore performance, security, and sustainability metrics
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">3</span>
              </div>
              <h3 className="font-medium mb-2">Export & Share</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate reports and share insights with your team
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button asChild>
              <Link href="/docs/quick-start">
                View Complete Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">API Overview</CardTitle>
          <CardDescription>RESTful API with comprehensive endpoints for website analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Core Endpoints</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">POST</Badge>
                  <code className="text-sm">/api/analyze</code>
                  <span className="text-sm text-gray-500">- Website analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  <code className="text-sm">/api/hosting-providers</code>
                  <span className="text-sm text-gray-500">- Hosting data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">POST</Badge>
                  <code className="text-sm">/api/generate-content</code>
                  <span className="text-sm text-gray-500">- AI content</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">POST</Badge>
                  <code className="text-sm">/api/export</code>
                  <span className="text-sm text-gray-500">- Export results</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  RESTful JSON API
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Rate limiting protection
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Comprehensive error handling
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Real-time analysis
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <Button asChild>
              <Link href="/docs/api">
                Explore API Documentation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Community & Support</CardTitle>
            <CardDescription>Get help and connect with other developers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link
                href="/support"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Support Center</div>
                    <div className="text-sm text-gray-500">FAQs and troubleshooting</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/blog"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Blog</div>
                    <div className="text-sm text-gray-500">Updates and tutorials</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Updates</CardTitle>
            <CardDescription>Recent improvements and new features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="font-medium">Enhanced Security Analysis</div>
                <div className="text-sm text-gray-500">
                  Added comprehensive security headers analysis and SSL validation
                </div>
                <div className="text-xs text-gray-400 mt-1">2 days ago</div>
              </div>

              <div className="border-l-4 border-teal-500 pl-4">
                <div className="font-medium">AI Content Generation</div>
                <div className="text-sm text-gray-500">
                  New AI-powered content generation for research and marketing
                </div>
                <div className="text-xs text-gray-400 mt-1">1 week ago</div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <div className="font-medium">Hosting Provider Database</div>
                <div className="text-sm text-gray-500">Added comprehensive green hosting provider catalog</div>
                <div className="text-xs text-gray-400 mt-1">2 weeks ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

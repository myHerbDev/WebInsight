import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Code,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Info,
  Sparkles,
  Lock,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { AnalyticsGraphic } from "@/components/analytics-graphic"

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
            WebInSight Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive website analysis, sustainability metrics, and performance insights. Get started with our
            powerful API and tools.
          </p>
        </div>

        {/* Login CTA Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-left">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6" />
                Login to save, export, and compare your results
              </h2>
              <p className="text-purple-100 mb-6">
                Create a free account to unlock advanced features including result saving, PDF exports, website
                comparisons, and personalized recommendations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Create Free Account
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <AnalyticsGraphic className="w-64 h-48" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Quick Start</CardTitle>
            </div>
            <CardDescription>Get up and running with WebInSight in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Learn how to analyze your first website and understand the results.
            </p>
            <Link href="/docs/quick-start">
              <Button className="w-full">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">API Reference</CardTitle>
            </div>
            <CardDescription>Complete API documentation with examples</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Integrate WebInSight into your applications with our REST API.
            </p>
            <Link href="/docs/api">
              <Button variant="outline" className="w-full">
                View API Docs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">Guides</CardTitle>
            </div>
            <CardDescription>In-depth tutorials and best practices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Learn advanced techniques for website optimization and analysis.
            </p>
            <Link href="/docs/guides/analysis">
              <Button variant="outline" className="w-full">
                Browse Guides
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">What You Can Do</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">Powerful tools for comprehensive website analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-purple-500" />
                <CardTitle>Website Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Get comprehensive insights into website performance, security, and sustainability.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Performance metrics and optimization tips</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Security assessment and recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sustainability scoring and green hosting detection</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-teal-500" />
                <CardTitle>AI-Powered Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Generate intelligent content and recommendations based on your analysis.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Automated content generation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Personalized improvement suggestions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Competitive analysis and benchmarking</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Features */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            <CardTitle className="text-purple-900 dark:text-purple-100">Premium Features</CardTitle>
          </div>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            Unlock advanced capabilities with a WebInSight account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-purple-900 dark:text-purple-100">Analysis & Export</h4>
              <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Save unlimited analysis results
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Export reports as PDF or Markdown
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Historical analysis tracking
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-purple-900 dark:text-purple-100">Collaboration & Insights</h4>
              <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Compare multiple websites
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Advanced AI content generation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Priority support and updates
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Help */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Need Help?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-8 w-8 text-blue-500 mx-auto" />
              <CardTitle className="text-lg">Support Center</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Find answers to common questions and get help from our team.
              </p>
              <Link href="/support">
                <Button variant="outline" size="sm">
                  Visit Support
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-green-500 mx-auto" />
              <CardTitle className="text-lg">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Connect with other users and share insights in our community.
              </p>
              <Link href="/docs/community">
                <Button variant="outline" size="sm">
                  Join Community
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-purple-500 mx-auto" />
              <CardTitle className="text-lg">Blog</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Read tutorials, tips, and updates from the WebInSight team.
              </p>
              <Link href="/blog">
                <Button variant="outline" size="sm">
                  Read Blog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Final CTA */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Ready to get started?</strong> Try analyzing your first website or explore our API documentation to
          integrate WebInSight into your workflow.
        </AlertDescription>
      </Alert>
    </div>
  )
}

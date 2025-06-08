import { Suspense } from "react"
import { WebsiteForm } from "@/components/website-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, BarChart3, Shield, Zap, Globe, Brain, ArrowRight, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Intelligent Analysis",
    description: "Deep website analysis with AI-powered insights and comprehensive data extraction.",
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    description: "Detailed performance analysis including speed, SEO, security, and accessibility scores.",
  },
  {
    icon: Shield,
    title: "Security Assessment",
    description: "Comprehensive security evaluation and vulnerability detection for enhanced protection.",
  },
  {
    icon: Brain,
    title: "AI Content Generation",
    description: "Generate professional content based on website analysis with advanced AI technology.",
  },
  {
    icon: Globe,
    title: "Hosting Intelligence",
    description: "Detailed hosting provider analysis and infrastructure insights for optimization.",
  },
  {
    icon: Zap,
    title: "Real-time Results",
    description: "Instant analysis results with detailed reports and actionable recommendations.",
  },
]

const benefits = [
  "Comprehensive website analysis in seconds",
  "AI-powered content generation",
  "Security and performance insights",
  "Hosting provider intelligence",
  "SEO optimization recommendations",
  "Export and share analysis results",
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              🚀 Intelligent Website Discovery
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Discover, Analyze, and
              <span className="text-primary"> Generate</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              WSfynder provides comprehensive website analysis, performance insights, and AI-powered content generation
              to help you understand and optimize any website on the internet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link href="#analyze">
                  Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/features">Learn More</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Websites Analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Data Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Form Section */}
      <section id="analyze" className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Analyze Any Website</h2>
            <p className="text-muted-foreground">
              Enter a website URL to get comprehensive analysis including performance, security, SEO, and hosting
              information.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Suspense
              fallback={
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            >
              <WebsiteForm />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Website Intelligence</h2>
            <p className="text-muted-foreground">
              Everything you need to understand, analyze, and optimize websites with professional-grade accuracy and
              AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose WSfynder?</h2>
              <p className="text-muted-foreground mb-8">
                WSfynder combines advanced website analysis with AI-powered content generation to provide comprehensive
                insights that help you make informed decisions about any website.
              </p>

              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button asChild>
                  <Link href="/features">
                    Explore All Features <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
                <div className="w-full h-full bg-background rounded-xl shadow-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced algorithms provide deep insights and actionable recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Discover Website Intelligence?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who trust WSfynder for comprehensive website analysis and AI-powered content
              generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#analyze">Start Free Analysis</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/content-studio">Try Content Studio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

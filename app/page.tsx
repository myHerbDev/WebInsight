import { Suspense } from "react"
import { WebsiteForm } from "@/components/website-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, BarChart3, Shield, Zap, Globe, Brain, ArrowRight, CheckCircle, Star, Clock } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WSfynder - Intelligent Website Analysis & AI Content Platform",
  description:
    "Analyze any website with WSfynder's AI-powered platform. Get comprehensive insights on performance, SEO, security, sustainability, and generate professional content instantly.",
  openGraph: {
    title: "WSfynder - Intelligent Website Analysis & AI Content Platform",
    description:
      "Analyze any website with AI-powered insights. Performance, SEO, security analysis plus content generation.",
    type: "website",
    url: "https://wsfynder.com",
  },
  alternates: {
    canonical: "https://wsfynder.com",
  },
}

const features = [
  {
    icon: Search,
    title: "Intelligent Analysis",
    description: "Deep website analysis with AI-powered insights and comprehensive data extraction in seconds.",
    benefits: ["50+ data points", "Real-time analysis", "Detailed reports"],
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    description: "Detailed performance analysis including speed, SEO, security, and accessibility scores.",
    benefits: ["Core Web Vitals", "Loading speed", "Optimization tips"],
  },
  {
    icon: Shield,
    title: "Security Assessment",
    description: "Comprehensive security evaluation and vulnerability detection for enhanced protection.",
    benefits: ["SSL analysis", "Header security", "Threat detection"],
  },
  {
    icon: Brain,
    title: "AI Content Generation",
    description: "Generate professional content based on website analysis with advanced AI technology.",
    benefits: ["Multiple formats", "SEO optimized", "Custom prompts"],
  },
  {
    icon: Globe,
    title: "Hosting Intelligence",
    description: "Detailed hosting provider analysis and infrastructure insights for optimization.",
    benefits: ["Provider detection", "Server location", "Performance impact"],
  },
  {
    icon: Zap,
    title: "Real-time Results",
    description: "Instant analysis results with detailed reports and actionable recommendations.",
    benefits: ["< 30 seconds", "Exportable data", "Shareable reports"],
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

const testimonials = [
  {
    quote: "WSfynder has revolutionized how we analyze competitor websites. The AI insights are incredibly valuable.",
    author: "Sarah Chen",
    role: "Digital Marketing Manager",
    rating: 5,
  },
  {
    quote: "The performance analysis helped us identify critical issues that improved our page speed by 40%.",
    author: "Mike Rodriguez",
    role: "Web Developer",
    rating: 5,
  },
  {
    quote: "Best website analysis tool I've used. The content generation feature is a game-changer.",
    author: "Emma Thompson",
    role: "SEO Specialist",
    rating: 5,
  },
]

const stats = [
  { value: "50K+", label: "Websites Analyzed", icon: Globe },
  { value: "100+", label: "Data Points", icon: BarChart3 },
  { value: "99.9%", label: "Uptime", icon: Clock },
  { value: "4.9/5", label: "User Rating", icon: Star },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "WSfynder",
            description: "Intelligent website analysis and AI content generation platform",
            url: "https://wsfynder.com",
            applicationCategory: "WebApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "1247",
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden" aria-labelledby="hero-heading">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6" role="img" aria-label="New feature">
              🚀 Intelligent Website Discovery
            </Badge>

            <h1 id="hero-heading" className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Analyze, Understand, and
              <span className="text-primary bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                {" "}
                Optimize
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              WSfynder provides comprehensive website analysis, performance insights, and AI-powered content generation
              to help you understand and optimize any website on the internet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                <Link href="#analyze" aria-describedby="cta-description">
                  Start Free Analysis <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/features">Learn More</Link>
              </Button>
            </div>
            <p id="cta-description" className="sr-only">
              Start analyzing websites for free with comprehensive insights
            </p>

            {/* Stats Grid */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
              role="region"
              aria-label="Platform statistics"
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <stat.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Form Section */}
      <section id="analyze" className="py-20 bg-muted/50" aria-labelledby="analyze-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 id="analyze-heading" className="text-3xl font-bold mb-4">
              Analyze Any Website Instantly
            </h2>
            <p className="text-muted-foreground">
              Enter a website URL to get comprehensive analysis including performance, security, SEO, hosting
              information, and sustainability metrics.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Suspense
              fallback={
                <div className="flex justify-center" role="status" aria-label="Loading website analysis form">
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
      <section className="py-20" aria-labelledby="features-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 id="features-heading" className="text-3xl font-bold mb-4">
              Powerful Features for Website Intelligence
            </h2>
            <p className="text-muted-foreground">
              Everything you need to understand, analyze, and optimize websites with professional-grade accuracy and
              AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50" aria-labelledby="testimonials-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 id="testimonials-heading" className="text-3xl font-bold mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-muted-foreground">
              See what our users say about WSfynder's powerful analysis capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex mb-4" role="img" aria-label={`${testimonial.rating} star rating`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20" aria-labelledby="benefits-heading">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="benefits-heading" className="text-3xl font-bold mb-6">
                Why Choose WSfynder?
              </h2>
              <p className="text-muted-foreground mb-8">
                WSfynder combines advanced website analysis with AI-powered content generation to provide comprehensive
                insights that help you make informed decisions about any website.
              </p>

              <ul className="space-y-4" role="list">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                >
                  <Link href="/features">
                    Explore All Features <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
                <div className="w-full h-full bg-background rounded-xl shadow-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-8 w-8 text-white" aria-hidden="true" />
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
      <section className="py-20" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold mb-4">
              Ready to Discover Website Intelligence?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who trust WSfynder for comprehensive website analysis and AI-powered content
              generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
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

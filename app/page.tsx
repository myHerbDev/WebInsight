import type { Metadata } from "next"
import { WebsiteForm } from "@/components/website-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Shield,
  Zap,
  Eye,
  TreePine,
  Smartphone,
  BarChart3,
  FileText,
  CheckCircle,
  Star,
  Users,
  Globe,
} from "lucide-react"

export const metadata: Metadata = {
  title: "WSfynder - Advanced Website Analysis & Intelligence Platform",
  description:
    "Analyze any website with WSfynder's comprehensive platform. Get detailed insights on performance, SEO, security, accessibility, and sustainability. Free website analysis with AI-powered recommendations.",
  keywords: [
    "website analysis",
    "free website analyzer",
    "SEO audit",
    "website performance test",
    "security scan",
    "accessibility checker",
    "sustainability analysis",
    "website optimization",
    "site audit tool",
    "web analytics",
  ],
  openGraph: {
    title: "WSfynder - Free Website Analysis & Intelligence Platform",
    description:
      "Get comprehensive website insights with our advanced analysis platform. Performance, SEO, security, and more.",
    url: "https://wsfynder.com",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "WSfynder Homepage - Website Analysis Platform",
      },
    ],
  },
  alternates: {
    canonical: "https://wsfynder.com",
  },
}

const features = [
  {
    icon: Zap,
    title: "Performance Analysis",
    description: "Comprehensive speed and optimization metrics",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "In-depth search engine optimization insights",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Security Audit",
    description: "Advanced security headers and vulnerability checks",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Eye,
    title: "Accessibility Testing",
    description: "WCAG compliance and accessibility improvements",
    gradient: "from-purple-500 to-violet-500",
  },
  {
    icon: TreePine,
    title: "Sustainability Metrics",
    description: "Environmental impact and carbon footprint analysis",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimization",
    description: "Responsive design and mobile performance testing",
    gradient: "from-pink-500 to-rose-500",
  },
]

const stats = [
  { icon: Globe, value: "10M+", label: "Websites Analyzed" },
  { icon: Users, value: "50K+", label: "Active Users" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
  { icon: CheckCircle, value: "99.9%", label: "Uptime" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Advanced Website Analysis & Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Discover comprehensive insights about any website with WSfynder's powerful analysis platform. Get detailed
              reports on performance, SEO, security, accessibility, and sustainability.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Free Analysis
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Zap className="h-4 w-4 mr-2" />
                Instant Results
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <FileText className="h-4 w-4 mr-2" />
                AI-Powered Insights
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Website Analysis Form */}
      <section className="py-16 px-4 bg-white" aria-labelledby="analysis-heading">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 id="analysis-heading" className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Analyze Any Website
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter a website URL below to get started with your comprehensive analysis
            </p>
          </div>
          <WebsiteForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50" aria-labelledby="features-heading">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Comprehensive Analysis Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              WSfynder provides detailed insights across multiple dimensions of website performance and optimization
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600" aria-labelledby="stats-heading">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 id="stats-heading" className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Join thousands of developers and businesses who trust WSfynder for their website analysis needs
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white" aria-labelledby="cta-heading">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Ready to Optimize Your Website?
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Get started with WSfynder today and discover actionable insights to improve your website's performance,
              SEO, security, and user experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#analysis-heading"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300"
                aria-label="Start analyzing your website"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Start Free Analysis
              </a>
              <a
                href="/features"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-all duration-300"
                aria-label="Learn more about WSfynder features"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

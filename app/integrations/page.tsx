import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ExternalLink, Code, Zap, Shield, Globe, Database, Cloud } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Integrations | Connect WSfynder with Your Favorite Tools",
  description:
    "Integrate WSfynder with popular development tools, CMSs, and platforms. Streamline your workflow with our comprehensive integration ecosystem.",
}

const integrationCategories = [
  {
    name: "Development Tools",
    icon: Code,
    color: "from-blue-500 to-blue-600",
    integrations: [
      {
        name: "GitHub Actions",
        description: "Automate website analysis in your CI/CD pipeline",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "CI/CD",
      },
      {
        name: "GitLab CI",
        description: "Integrate analysis into GitLab workflows",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "CI/CD",
      },
      {
        name: "Jenkins",
        description: "Add website analysis to Jenkins builds",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "CI/CD",
      },
      {
        name: "VS Code Extension",
        description: "Analyze websites directly from your editor",
        logo: "/placeholder-logo.svg",
        status: "Coming Soon",
        type: "Editor",
      },
    ],
  },
  {
    name: "Content Management",
    icon: Globe,
    color: "from-green-500 to-green-600",
    integrations: [
      {
        name: "WordPress",
        description: "Plugin for automatic website optimization",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "CMS",
      },
      {
        name: "Drupal",
        description: "Module for performance monitoring",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "CMS",
      },
      {
        name: "Shopify",
        description: "E-commerce optimization app",
        logo: "/placeholder-logo.svg",
        status: "Beta",
        type: "E-commerce",
      },
      {
        name: "Webflow",
        description: "Design tool integration for optimization",
        logo: "/placeholder-logo.svg",
        status: "Coming Soon",
        type: "Design",
      },
    ],
  },
  {
    name: "Cloud Platforms",
    icon: Cloud,
    color: "from-purple-500 to-purple-600",
    integrations: [
      {
        name: "Vercel",
        description: "Deploy-time analysis and optimization",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "Hosting",
      },
      {
        name: "Netlify",
        description: "Build plugin for performance checks",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "Hosting",
      },
      {
        name: "AWS CloudFront",
        description: "CDN optimization recommendations",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "CDN",
      },
      {
        name: "Cloudflare",
        description: "Performance and security integration",
        logo: "/placeholder-logo.svg",
        status: "Beta",
        type: "CDN",
      },
    ],
  },
  {
    name: "Analytics & Monitoring",
    icon: Database,
    color: "from-orange-500 to-orange-600",
    integrations: [
      {
        name: "Google Analytics",
        description: "Enhanced performance insights",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "Analytics",
      },
      {
        name: "Google Search Console",
        description: "SEO data integration",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "SEO",
      },
      {
        name: "New Relic",
        description: "Application performance monitoring",
        logo: "/placeholder-logo.svg",
        status: "Available",
        type: "Monitoring",
      },
      {
        name: "Datadog",
        description: "Infrastructure monitoring integration",
        logo: "/placeholder-logo.svg",
        status: "Beta",
        type: "Monitoring",
      },
    ],
  },
]

const apiFeatures = [
  {
    title: "RESTful API",
    description: "Simple HTTP API for website analysis",
    icon: Code,
  },
  {
    title: "Real-time Webhooks",
    description: "Get notified when analysis completes",
    icon: Zap,
  },
  {
    title: "Secure Authentication",
    description: "API keys and OAuth 2.0 support",
    icon: Shield,
  },
  {
    title: "Rate Limiting",
    description: "Fair usage policies and limits",
    icon: Database,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-800"
    case "Beta":
      return "bg-blue-100 text-blue-800"
    case "Coming Soon":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              Integrations
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect WSfynder with your favorite tools and platforms. Streamline your workflow with our comprehensive
            integration ecosystem.
          </p>
        </div>

        {/* Stats */}
        <Card className="mb-12 bg-gradient-to-r from-purple-50 to-green-50 border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Integrations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">API Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10M+</div>
                <div className="text-sm text-muted-foreground">API Calls/Month</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Categories */}
        <div className="space-y-12">
          {integrationCategories.map((category, categoryIndex) => (
            <section key={categoryIndex}>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}
                >
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <p className="text-muted-foreground">{category.integrations.length} integrations available</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.integrations.map((integration, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <img
                          src={integration.logo || "/placeholder.svg"}
                          alt={integration.name}
                          className="w-10 h-10 rounded-lg"
                        />
                        <Badge className={getStatusColor(integration.status)}>{integration.status}</Badge>
                      </div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{integration.type}</Badge>
                        <Button size="sm" variant="outline">
                          {integration.status === "Available" ? "Install" : "Learn More"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* API Section */}
        <Card className="mt-16 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Code className="h-6 w-6" />
              WSfynder API
            </CardTitle>
            <CardDescription>Build custom integrations with our powerful and flexible API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {apiFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-6">
              <h4 className="font-semibold mb-3">Quick Start Example</h4>
              <pre className="text-sm overflow-x-auto">
                <code>{`curl -X POST https://api.wsfynder.com/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}</code>
              </pre>
            </div>

            <div className="flex gap-4 mt-6">
              <Button asChild>
                <Link href="/docs/api">API Documentation</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Get API Key</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Integrations */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Custom Integrations</CardTitle>
            <CardDescription>Need a custom integration? We can help build it for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Custom Development</h4>
                <p className="text-sm text-muted-foreground">
                  We'll build a custom integration tailored to your specific needs and workflow.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Enterprise Support</h4>
                <p className="text-sm text-muted-foreground">
                  Dedicated support team to help with integration setup and maintenance.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Fast Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Most custom integrations are delivered within 2-4 weeks.
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link href="/contact">Request Custom Integration</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Integrations */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Community Integrations</CardTitle>
            <CardDescription>Integrations built by our amazing community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/placeholder-logo.svg" alt="Slack" className="w-8 h-8 rounded" />
                  <div>
                    <h4 className="font-semibold">Slack Bot</h4>
                    <p className="text-xs text-muted-foreground">by @johndoe</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get website analysis results directly in your Slack channels.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on GitHub
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/placeholder-logo.svg" alt="Discord" className="w-8 h-8 rounded" />
                  <div>
                    <h4 className="font-semibold">Discord Bot</h4>
                    <p className="text-xs text-muted-foreground">by @janedoe</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Analyze websites and share results in Discord servers.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on GitHub
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/placeholder-logo.svg" alt="Zapier" className="w-8 h-8 rounded" />
                  <div>
                    <h4 className="font-semibold">Zapier Integration</h4>
                    <p className="text-xs text-muted-foreground">by @community</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Connect WSfynder with 5000+ apps through Zapier.</p>
                <Button size="sm" variant="outline" className="w-full">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Use Zap
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Integrate?</h3>
            <p className="text-muted-foreground mb-6">
              Start building with WSfynder today. Get your API key and explore our comprehensive documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                <Link href="/docs/api">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

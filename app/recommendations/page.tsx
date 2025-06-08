import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Zap,
  Search,
  Shield,
  Eye,
  Smartphone,
  TreePine,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Website Optimization Recommendations | WSfynder",
  description:
    "Comprehensive website optimization recommendations from WSfynder. Improve performance, SEO, security, accessibility, and sustainability with our expert guides.",
}

const recommendationCategories = [
  {
    id: "performance",
    title: "Performance Optimization",
    description: "Speed up your website and improve user experience",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    recommendations: [
      {
        id: "image-optimization",
        title: "Image Optimization",
        description: "Compress and optimize images for faster loading",
        difficulty: "Easy",
        impact: "High",
        timeToImplement: "1-2 hours",
      },
      {
        id: "minify-resources",
        title: "Minify CSS and JavaScript",
        description: "Reduce file sizes by removing unnecessary characters",
        difficulty: "Medium",
        impact: "Medium",
        timeToImplement: "2-4 hours",
      },
      {
        id: "enable-compression",
        title: "Enable Gzip Compression",
        description: "Compress files before sending to browsers",
        difficulty: "Easy",
        impact: "High",
        timeToImplement: "30 minutes",
      },
      {
        id: "cdn-implementation",
        title: "Content Delivery Network (CDN)",
        description: "Distribute content globally for faster access",
        difficulty: "Medium",
        impact: "High",
        timeToImplement: "1-3 hours",
      },
    ],
  },
  {
    id: "seo",
    title: "SEO Enhancement",
    description: "Improve search engine visibility and rankings",
    icon: Search,
    color: "from-green-500 to-green-600",
    recommendations: [
      {
        id: "meta-optimization",
        title: "Meta Tags Optimization",
        description: "Optimize title tags, meta descriptions, and headers",
        difficulty: "Easy",
        impact: "High",
        timeToImplement: "2-3 hours",
      },
      {
        id: "structured-data",
        title: "Structured Data Implementation",
        description: "Add schema markup for better search understanding",
        difficulty: "Medium",
        impact: "Medium",
        timeToImplement: "3-5 hours",
      },
      {
        id: "internal-linking",
        title: "Internal Linking Strategy",
        description: "Improve site structure with strategic internal links",
        difficulty: "Easy",
        impact: "Medium",
        timeToImplement: "2-4 hours",
      },
      {
        id: "sitemap-optimization",
        title: "XML Sitemap Optimization",
        description: "Create and optimize sitemaps for search engines",
        difficulty: "Easy",
        impact: "Medium",
        timeToImplement: "1 hour",
      },
    ],
  },
  {
    id: "security",
    title: "Security Hardening",
    description: "Protect your website from threats and vulnerabilities",
    icon: Shield,
    color: "from-red-500 to-red-600",
    recommendations: [
      {
        id: "ssl-implementation",
        title: "SSL Certificate Implementation",
        description: "Secure data transmission with HTTPS",
        difficulty: "Easy",
        impact: "High",
        timeToImplement: "1 hour",
      },
      {
        id: "security-headers",
        title: "Security Headers Configuration",
        description: "Add security headers to prevent attacks",
        difficulty: "Medium",
        impact: "High",
        timeToImplement: "2-3 hours",
      },
      {
        id: "regular-updates",
        title: "Regular Software Updates",
        description: "Keep all software and plugins up to date",
        difficulty: "Easy",
        impact: "High",
        timeToImplement: "Ongoing",
      },
      {
        id: "backup-strategy",
        title: "Backup Strategy Implementation",
        description: "Set up automated backups for data protection",
        difficulty: "Medium",
        impact: "High",
        timeToImplement: "2-4 hours",
      },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility Improvements",
    description: "Make your website accessible to all users",
    icon: Eye,
    color: "from-blue-500 to-blue-600",
    recommendations: [
      {
        id: "alt-text-images",
        title: "Alt Text for Images",
        description: "Add descriptive alt text to all images",
        difficulty: "Easy",
        impact: "High",
        timeToImplement: "1-2 hours",
      },
      {
        id: "keyboard-navigation",
        title: "Keyboard Navigation",
        description: "Ensure all functionality is keyboard accessible",
        difficulty: "Medium",
        impact: "High",
        timeToImplement: "3-5 hours",
      },
      {
        id: "color-contrast",
        title: "Color Contrast Optimization",
        description: "Improve color contrast for better readability",
        difficulty: "Easy",
        impact: "Medium",
        timeToImplement: "2-3 hours",
      },
      {
        id: "aria-labels",
        title: "ARIA Labels Implementation",
        description: "Add ARIA labels for screen reader compatibility",
        difficulty: "Medium",
        impact: "High",
        timeToImplement: "3-4 hours",
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Optimization",
    description: "Optimize for mobile devices and responsive design",
    icon: Smartphone,
    color: "from-indigo-500 to-indigo-600",
    recommendations: [
      {
        id: "responsive-design",
        title: "Responsive Design Implementation",
        description: "Ensure your site works on all device sizes",
        difficulty: "Hard",
        impact: "High",
        timeToImplement: "1-2 weeks",
      },
      {
        id: "touch-optimization",
        title: "Touch Target Optimization",
        description: "Make buttons and links easy to tap on mobile",
        difficulty: "Easy",
        impact: "Medium",
        timeToImplement: "2-3 hours",
      },
      {
        id: "mobile-speed",
        title: "Mobile Speed Optimization",
        description: "Optimize loading speed specifically for mobile",
        difficulty: "Medium",
        impact: "High",
        timeToImplement: "4-6 hours",
      },
      {
        id: "viewport-meta",
        title: "Viewport Meta Tag",
        description: "Configure viewport for proper mobile rendering",
        difficulty: "Easy",
        impact: "High",
        timeToImplement: "15 minutes",
      },
    ],
  },
  {
    id: "sustainability",
    title: "Sustainability Optimization",
    description: "Reduce environmental impact and improve efficiency",
    icon: TreePine,
    color: "from-emerald-500 to-emerald-600",
    recommendations: [
      {
        id: "green-hosting",
        title: "Green Hosting Provider",
        description: "Switch to renewable energy-powered hosting",
        difficulty: "Medium",
        impact: "High",
        timeToImplement: "1-2 days",
      },
      {
        id: "resource-optimization",
        title: "Resource Usage Optimization",
        description: "Minimize server resources and energy consumption",
        difficulty: "Medium",
        impact: "Medium",
        timeToImplement: "3-5 hours",
      },
      {
        id: "efficient-coding",
        title: "Efficient Code Practices",
        description: "Write cleaner, more efficient code",
        difficulty: "Hard",
        impact: "Medium",
        timeToImplement: "Ongoing",
      },
      {
        id: "carbon-monitoring",
        title: "Carbon Footprint Monitoring",
        description: "Track and monitor your website's carbon impact",
        difficulty: "Easy",
        impact: "Low",
        timeToImplement: "1 hour",
      },
    ],
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Hard":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case "High":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "Medium":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "Low":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-600" />
  }
}

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              Website Optimization Recommendations
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guides to improve your website's performance, SEO, security, accessibility, mobile experience,
            and sustainability.
          </p>
        </div>

        <div className="space-y-12">
          {recommendationCategories.map((category) => (
            <section key={category.id} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}
                >
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.recommendations.map((recommendation) => (
                  <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{recommendation.title}</CardTitle>
                          <CardDescription className="text-sm">{recommendation.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <Badge className={getDifficultyColor(recommendation.difficulty)}>
                          {recommendation.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getImpactIcon(recommendation.impact)}
                          <span className="text-sm text-muted-foreground">{recommendation.impact} Impact</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">⏱️ {recommendation.timeToImplement}</span>
                        <Button asChild size="sm">
                          <Link href={`/recommendations/${category.id}/${recommendation.id}`}>
                            View Guide <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-green-50 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Need Personalized Recommendations?</h3>
              <p className="text-muted-foreground mb-6">
                Get customized optimization recommendations based on your specific website analysis.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                <Link href="/">
                  Analyze Your Website <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

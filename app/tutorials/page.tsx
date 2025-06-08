import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, Clock, User, BookOpen, Video, FileText, Zap, Shield, Eye, Smartphone, TreePine } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Website Optimization Tutorials | WSfynder Learning Center",
  description:
    "Learn website optimization with our comprehensive tutorials. Improve performance, SEO, security, accessibility, and more with step-by-step guides.",
}

const categories = [
  {
    id: "performance",
    name: "Performance",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    count: 12,
  },
  {
    id: "seo",
    name: "SEO",
    icon: Search,
    color: "from-green-500 to-green-600",
    count: 15,
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    color: "from-red-500 to-red-600",
    count: 8,
  },
  {
    id: "accessibility",
    name: "Accessibility",
    icon: Eye,
    color: "from-blue-500 to-blue-600",
    count: 10,
  },
  {
    id: "mobile",
    name: "Mobile",
    icon: Smartphone,
    color: "from-indigo-500 to-indigo-600",
    count: 7,
  },
  {
    id: "sustainability",
    name: "Sustainability",
    icon: TreePine,
    color: "from-emerald-500 to-emerald-600",
    count: 5,
  },
]

const featuredTutorials = [
  {
    id: "complete-seo-guide",
    title: "Complete SEO Optimization Guide",
    description: "Master SEO fundamentals and advanced techniques to improve your website's search rankings.",
    category: "SEO",
    difficulty: "Intermediate",
    duration: "45 min",
    type: "Article",
    author: "Sarah Rodriguez",
    image: "/placeholder.jpg",
    tags: ["SEO", "Rankings", "Keywords", "Meta Tags"],
  },
  {
    id: "web-performance-optimization",
    title: "Web Performance Optimization Masterclass",
    description: "Learn how to make your website lightning fast with proven optimization techniques.",
    category: "Performance",
    difficulty: "Advanced",
    duration: "60 min",
    type: "Video",
    author: "Alex Chen",
    image: "/placeholder.jpg",
    tags: ["Performance", "Speed", "Core Web Vitals", "Optimization"],
  },
  {
    id: "accessibility-fundamentals",
    title: "Web Accessibility Fundamentals",
    description: "Make your website accessible to everyone with this comprehensive accessibility guide.",
    category: "Accessibility",
    difficulty: "Beginner",
    duration: "30 min",
    type: "Article",
    author: "Emily Davis",
    image: "/placeholder.jpg",
    tags: ["Accessibility", "WCAG", "Screen Readers", "Inclusive Design"],
  },
]

const allTutorials = [
  {
    id: "image-optimization-guide",
    title: "Image Optimization for Web Performance",
    description: "Learn how to optimize images for faster loading times without sacrificing quality.",
    category: "Performance",
    difficulty: "Beginner",
    duration: "20 min",
    type: "Article",
    author: "Mike Johnson",
    tags: ["Images", "Compression", "WebP", "Performance"],
  },
  {
    id: "ssl-certificate-setup",
    title: "Setting Up SSL Certificates",
    description: "Step-by-step guide to implementing SSL certificates for website security.",
    category: "Security",
    difficulty: "Intermediate",
    duration: "25 min",
    type: "Video",
    author: "Sarah Rodriguez",
    tags: ["SSL", "HTTPS", "Security", "Certificates"],
  },
  {
    id: "mobile-responsive-design",
    title: "Creating Mobile-Responsive Designs",
    description: "Design websites that work perfectly on all devices and screen sizes.",
    category: "Mobile",
    difficulty: "Intermediate",
    duration: "40 min",
    type: "Article",
    author: "Emily Davis",
    tags: ["Responsive", "Mobile", "CSS", "Design"],
  },
  {
    id: "green-hosting-guide",
    title: "Choosing Green Hosting Providers",
    description: "Reduce your website's environmental impact with sustainable hosting solutions.",
    category: "Sustainability",
    difficulty: "Beginner",
    duration: "15 min",
    type: "Article",
    author: "Alex Chen",
    tags: ["Green Hosting", "Sustainability", "Environment", "Carbon Footprint"],
  },
  {
    id: "structured-data-implementation",
    title: "Implementing Structured Data",
    description: "Enhance your SEO with proper structured data markup and schema implementation.",
    category: "SEO",
    difficulty: "Advanced",
    duration: "35 min",
    type: "Video",
    author: "Sarah Rodriguez",
    tags: ["Structured Data", "Schema", "SEO", "Rich Snippets"],
  },
  {
    id: "security-headers-guide",
    title: "Essential Security Headers",
    description: "Protect your website with proper security headers configuration.",
    category: "Security",
    difficulty: "Intermediate",
    duration: "30 min",
    type: "Article",
    author: "Mike Johnson",
    tags: ["Security Headers", "CSP", "HSTS", "Security"],
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800"
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800"
    case "Advanced":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Video":
      return <Video className="h-4 w-4" />
    case "Article":
      return <FileText className="h-4 w-4" />
    default:
      return <BookOpen className="h-4 w-4" />
  }
}

export default function TutorialsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              Learning Center
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Master website optimization with our comprehensive tutorials, guides, and best practices.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tutorials..." className="pl-10" />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}
                  >
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} tutorials</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Tutorials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Tutorials</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredTutorials.map((tutorial) => (
              <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                  <img
                    src={tutorial.image || "/placeholder.svg"}
                    alt={tutorial.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>{tutorial.difficulty}</Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getTypeIcon(tutorial.type)}
                      {tutorial.type}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span>{tutorial.duration}</span>
                    <span>•</span>
                    <User className="h-4 w-4" />
                    <span>{tutorial.author}</span>
                  </div>
                  <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                  <CardDescription>{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutorial.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/tutorials/${tutorial.id}`}>Start Tutorial</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Tutorials */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Tutorials</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {allTutorials.map((tutorial) => (
              <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(tutorial.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>{tutorial.difficulty}</Badge>
                        <Badge variant="outline">{tutorial.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{tutorial.duration}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                      <p className="text-muted-foreground mb-3">{tutorial.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {tutorial.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">by {tutorial.author}</span>
                          <Button size="sm" asChild>
                            <Link href={`/tutorials/${tutorial.id}`}>Start</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Paths */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Learning Paths</CardTitle>
            <CardDescription>
              Structured learning paths to master specific areas of website optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">🚀 Performance Optimization Path</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Master website performance from basics to advanced techniques
                </p>
                <div className="text-xs text-muted-foreground mb-3">6 tutorials • 4 hours • Beginner to Advanced</div>
                <Button size="sm" variant="outline" className="w-full">
                  Start Path
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">🔍 SEO Mastery Path</h4>
                <p className="text-sm text-muted-foreground mb-3">Complete guide to search engine optimization</p>
                <div className="text-xs text-muted-foreground mb-3">8 tutorials • 5 hours • Beginner to Advanced</div>
                <Button size="sm" variant="outline" className="w-full">
                  Start Path
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">🛡️ Security Fundamentals Path</h4>
                <p className="text-sm text-muted-foreground mb-3">Essential security practices for web developers</p>
                <div className="text-xs text-muted-foreground mb-3">
                  5 tutorials • 3 hours • Beginner to Intermediate
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Start Path
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your Website?</h3>
            <p className="text-muted-foreground mb-6">
              Put your knowledge into practice with WSfynder's comprehensive website analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                <Link href="/">Analyze Your Website</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/community">Join Community</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

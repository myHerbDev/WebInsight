import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, User, ArrowRight, TrendingUp, Zap, Shield, Globe, Clock, Tag } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const blogPosts = [
  {
    id: 1,
    title: "The Complete Guide to Website Sustainability in 2024",
    excerpt:
      "Learn how to reduce your website's carbon footprint and improve environmental impact with practical optimization techniques.",
    content:
      "Website sustainability has become a critical factor in modern web development. With the internet consuming approximately 4% of global electricity...",
    author: "myHerb Team",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Sustainability",
    tags: ["Green Web", "Performance", "Environment"],
    featured: true,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Understanding Website Security Headers: A Developer's Guide",
    excerpt:
      "Comprehensive overview of security headers and how they protect your website from common vulnerabilities.",
    content:
      "Security headers are HTTP response headers that tell browsers how to behave when handling your site's content...",
    author: "Security Team",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "Security",
    tags: ["Security", "Headers", "Best Practices"],
    featured: false,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "Performance Optimization: Core Web Vitals and Beyond",
    excerpt: "Deep dive into Core Web Vitals and advanced performance optimization techniques for modern websites.",
    content: "Core Web Vitals have become essential metrics for website performance and user experience...",
    author: "Performance Team",
    date: "2024-01-10",
    readTime: "10 min read",
    category: "Performance",
    tags: ["Performance", "Core Web Vitals", "Optimization"],
    featured: true,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "Green Hosting Providers: Making the Right Choice",
    excerpt: "Compare green hosting providers and learn how to choose environmentally responsible web hosting.",
    content: "Choosing the right hosting provider is crucial for your website's environmental impact...",
    author: "Sustainability Team",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "Hosting",
    tags: ["Green Hosting", "Environment", "Providers"],
    featured: false,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 5,
    title: "AI-Powered Content Generation for Website Analysis",
    excerpt: "Explore how AI can help generate insights and content based on website analysis data.",
    content: "Artificial Intelligence is revolutionizing how we analyze and understand website performance...",
    author: "AI Team",
    date: "2024-01-05",
    readTime: "5 min read",
    category: "AI & Technology",
    tags: ["AI", "Content Generation", "Analysis"],
    featured: false,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 6,
    title: "Website Analysis Best Practices: What to Look For",
    excerpt: "Essential metrics and indicators to focus on when analyzing website performance and user experience.",
    content: "Effective website analysis requires understanding which metrics matter most for your specific goals...",
    author: "Analysis Team",
    date: "2024-01-03",
    readTime: "9 min read",
    category: "Analysis",
    tags: ["Analysis", "Metrics", "Best Practices"],
    featured: false,
    image: "/placeholder.svg?height=200&width=400",
  },
]

const categories = [
  { name: "All", count: blogPosts.length, icon: Globe },
  { name: "Sustainability", count: 2, icon: Zap },
  { name: "Security", count: 1, icon: Shield },
  { name: "Performance", count: 1, icon: TrendingUp },
  { name: "Hosting", count: 1, icon: Globe },
  { name: "AI & Technology", count: 1, icon: Zap },
]

const popularTags = [
  "Green Web",
  "Performance",
  "Security",
  "Best Practices",
  "Environment",
  "Analysis",
  "Optimization",
  "AI",
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const recentPosts = blogPosts.filter((post) => !post.featured).slice(0, 4)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Sustainability":
        return Zap
      case "Security":
        return Shield
      case "Performance":
        return TrendingUp
      case "Hosting":
        return Globe
      default:
        return Globe
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Sustainability":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Security":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Performance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Hosting":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
      case "AI & Technology":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              WebInsight Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Insights, tutorials, and updates about website analysis, sustainability, and performance optimization.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search articles..." className="pl-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Featured Posts */}
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => {
                    const CategoryIcon = getCategoryIcon(post.category)
                    return (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow group">
                        <div className="aspect-video bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900 to-teal-900 rounded-t-lg flex items-center justify-center">
                          <CategoryIcon className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                        </div>
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </div>
                          </div>
                          <CardTitle className="group-hover:text-purple-600 transition-colors">
                            <Link href={`/blog/${post.id}`}>{post.title}</Link>
                          </CardTitle>
                          <CardDescription>{post.excerpt}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <User className="h-4 w-4" />
                              {post.author}
                              <Calendar className="h-4 w-4 ml-2" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/blog/${post.id}`}>
                                Read More
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </section>

              {/* Recent Posts */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
                <div className="space-y-6">
                  {recentPosts.map((post) => {
                    const CategoryIcon = getCategoryIcon(post.category)
                    return (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900 to-teal-900 rounded-lg flex items-center justify-center flex-shrink-0">
                              <CategoryIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {post.readTime}
                                </div>
                              </div>
                              <h3 className="text-xl font-semibold mb-2 hover:text-purple-600 transition-colors">
                                <Link href={`/blog/${post.id}`}>{post.title}</Link>
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-3">{post.excerpt}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <User className="h-4 w-4" />
                                  {post.author}
                                  <Calendar className="h-4 w-4 ml-2" />
                                  {new Date(post.date).toLocaleDateString()}
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/blog/${post.id}`}>Read Article</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </section>

              {/* Load More */}
              <div className="text-center">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <Link
                          key={category.name}
                          href={`/blog/category/${category.name.toLowerCase()}`}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-500" />
                            <span>{category.name}</span>
                          </div>
                          <Badge variant="secondary">{category.count}</Badge>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag.toLowerCase().replace(" ", "-")}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="bg-gradient-to-br from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20">
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                  <CardDescription>Get the latest insights on website optimization and sustainability.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Input placeholder="Enter your email" type="email" />
                    <Button className="w-full">Subscribe to Newsletter</Button>
                    <p className="text-xs text-gray-500 text-center">No spam. Unsubscribe at any time.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-l-4 border-purple-500 pl-3">
                      <div className="font-medium text-sm">Enhanced Security Analysis</div>
                      <div className="text-xs text-gray-500">2 days ago</div>
                    </div>
                    <div className="border-l-4 border-teal-500 pl-3">
                      <div className="font-medium text-sm">AI Content Generation</div>
                      <div className="text-xs text-gray-500">1 week ago</div>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-3">
                      <div className="font-medium text-sm">Green Hosting Database</div>
                      <div className="text-xs text-gray-500">2 weeks ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

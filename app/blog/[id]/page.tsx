import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Clock, ArrowLeft, BookOpen, Tag, TrendingUp, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { SocialShare } from "@/components/social-share"
import { BlogComments } from "@/components/blog-comments"
import { notFound } from "next/navigation"

const blogPosts = [
  {
    id: 1,
    title: "The Complete Guide to Website Sustainability in 2024",
    excerpt:
      "Learn how to reduce your website's carbon footprint and improve environmental impact with practical optimization techniques.",
    content: `
      <h2>Introduction to Website Sustainability</h2>
      <p>Website sustainability has become a critical factor in modern web development. With the internet consuming approximately 4% of global electricity and growing rapidly, it's essential for developers and businesses to consider the environmental impact of their digital presence.</p>
      
      <h2>Understanding Carbon Footprint</h2>
      <p>Every website visit generates carbon emissions through:</p>
      <ul>
        <li>Data center energy consumption</li>
        <li>Network infrastructure power usage</li>
        <li>End-user device energy consumption</li>
        <li>Content delivery and caching systems</li>
      </ul>
      
      <h2>Practical Optimization Techniques</h2>
      <p>Here are actionable steps to reduce your website's environmental impact:</p>
      
      <h3>1. Optimize Images and Media</h3>
      <p>Images often account for the largest portion of a website's data transfer. Use modern formats like WebP and AVIF, implement lazy loading, and compress images without sacrificing quality.</p>
      
      <h3>2. Minimize JavaScript and CSS</h3>
      <p>Reduce bundle sizes by removing unused code, implementing code splitting, and using efficient bundling strategies.</p>
      
      <h3>3. Choose Green Hosting</h3>
      <p>Select hosting providers that use renewable energy sources and have strong environmental commitments.</p>
      
      <h3>4. Implement Efficient Caching</h3>
      <p>Use CDNs, browser caching, and server-side caching to reduce repeated data transfers.</p>
      
      <h2>Measuring Your Impact</h2>
      <p>Tools like Website Carbon Calculator and EcoPing can help you measure and track your website's carbon footprint over time.</p>
      
      <h2>Conclusion</h2>
      <p>Building sustainable websites isn't just about environmental responsibility—it often leads to better performance, lower costs, and improved user experience. Start implementing these techniques today to make a positive impact.</p>
    `,
    author: "myHerb Team",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Sustainability",
    tags: ["Green Web", "Performance", "Environment"],
    featured: true,
    image: "/placeholder.svg?height=400&width=800&text=Website+Sustainability+Guide",
  },
  {
    id: 2,
    title: "Understanding Website Security Headers: A Developer's Guide",
    excerpt:
      "Comprehensive overview of security headers and how they protect your website from common vulnerabilities.",
    content: `
      <h2>What Are Security Headers?</h2>
      <p>Security headers are HTTP response headers that tell browsers how to behave when handling your site's content. They're your first line of defense against many common web vulnerabilities.</p>
      
      <h2>Essential Security Headers</h2>
      
      <h3>Content Security Policy (CSP)</h3>
      <p>CSP helps prevent XSS attacks by controlling which resources can be loaded on your page.</p>
      <pre><code>Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline';</code></pre>
      
      <h3>X-Frame-Options</h3>
      <p>Prevents your site from being embedded in frames, protecting against clickjacking attacks.</p>
      <pre><code>X-Frame-Options: DENY</code></pre>
      
      <h3>X-Content-Type-Options</h3>
      <p>Prevents MIME type sniffing attacks.</p>
      <pre><code>X-Content-Type-Options: nosniff</code></pre>
      
      <h3>Strict-Transport-Security (HSTS)</h3>
      <p>Forces browsers to use HTTPS connections.</p>
      <pre><code>Strict-Transport-Security: max-age=31536000; includeSubDomains</code></pre>
      
      <h2>Implementation Best Practices</h2>
      <p>Start with restrictive policies and gradually relax them as needed. Test thoroughly in development before deploying to production.</p>
      
      <h2>Testing Your Headers</h2>
      <p>Use tools like SecurityHeaders.com and Mozilla Observatory to audit your security headers implementation.</p>
    `,
    author: "Security Team",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "Security",
    tags: ["Security", "Headers", "Best Practices"],
    featured: false,
    image: "/placeholder.svg?height=400&width=800&text=Security+Headers+Guide",
  },
  {
    id: 3,
    title: "Performance Optimization: Core Web Vitals and Beyond",
    excerpt: "Deep dive into Core Web Vitals and advanced performance optimization techniques for modern websites.",
    content: `
      <h2>Understanding Core Web Vitals</h2>
      <p>Core Web Vitals have become essential metrics for website performance and user experience. Google uses these metrics as ranking factors, making them crucial for SEO success.</p>
      
      <h2>The Three Core Web Vitals</h2>
      
      <h3>Largest Contentful Paint (LCP)</h3>
      <p>Measures loading performance. Good LCP scores are 2.5 seconds or faster.</p>
      <ul>
        <li>Optimize server response times</li>
        <li>Use efficient image formats</li>
        <li>Implement preloading for critical resources</li>
      </ul>
      
      <h3>First Input Delay (FID)</h3>
      <p>Measures interactivity. Good FID scores are less than 100 milliseconds.</p>
      <ul>
        <li>Minimize JavaScript execution time</li>
        <li>Break up long tasks</li>
        <li>Use web workers for heavy computations</li>
      </ul>
      
      <h3>Cumulative Layout Shift (CLS)</h3>
      <p>Measures visual stability. Good CLS scores are less than 0.1.</p>
      <ul>
        <li>Include size attributes on images and videos</li>
        <li>Reserve space for ads and embeds</li>
        <li>Avoid inserting content above existing content</li>
      </ul>
      
      <h2>Advanced Optimization Techniques</h2>
      
      <h3>Resource Hints</h3>
      <p>Use preload, prefetch, and preconnect to optimize resource loading.</p>
      
      <h3>Code Splitting</h3>
      <p>Split your JavaScript bundles to load only what's needed for each page.</p>
      
      <h3>Critical CSS</h3>
      <p>Inline critical CSS and defer non-critical styles to improve rendering performance.</p>
      
      <h2>Monitoring and Measurement</h2>
      <p>Use tools like Lighthouse, PageSpeed Insights, and Real User Monitoring (RUM) to track performance over time.</p>
    `,
    author: "Performance Team",
    date: "2024-01-10",
    readTime: "10 min read",
    category: "Performance",
    tags: ["Performance", "Core Web Vitals", "Optimization"],
    featured: true,
    image: "/placeholder.svg?height=400&width=800&text=Core+Web+Vitals+Guide",
  },
  {
    id: 4,
    title: "Green Hosting Providers: Making the Right Choice",
    excerpt: "Compare green hosting providers and learn how to choose environmentally responsible web hosting.",
    content: `
      <h2>Why Green Hosting Matters</h2>
      <p>Choosing the right hosting provider is crucial for your website's environmental impact. Data centers consume massive amounts of energy, and selecting a green hosting provider can significantly reduce your carbon footprint.</p>
      
      <h2>What Makes Hosting "Green"?</h2>
      
      <h3>Renewable Energy</h3>
      <p>Look for providers that use 100% renewable energy sources like wind, solar, and hydroelectric power.</p>
      
      <h3>Energy Efficiency</h3>
      <p>Modern data centers with efficient cooling systems and hardware can reduce energy consumption by up to 50%.</p>
      
      <h3>Carbon Offsetting</h3>
      <p>Some providers invest in carbon offset programs to neutralize their environmental impact.</p>
      
      <h2>Top Green Hosting Providers</h2>
      
      <h3>GreenGeeks</h3>
      <p>300% renewable energy match with wind energy credits and tree planting initiatives.</p>
      
      <h3>A2 Hosting</h3>
      <p>Carbon neutral hosting with partnerships in renewable energy projects.</p>
      
      <h3>SiteGround</h3>
      <p>Google Cloud infrastructure with renewable energy commitments.</p>
      
      <h2>Evaluation Criteria</h2>
      <ul>
        <li>Renewable energy percentage</li>
        <li>Energy efficiency measures</li>
        <li>Transparency in reporting</li>
        <li>Third-party certifications</li>
        <li>Performance and reliability</li>
      </ul>
      
      <h2>Making the Switch</h2>
      <p>Migrating to green hosting is easier than ever with most providers offering free migration services and comprehensive support.</p>
    `,
    author: "Sustainability Team",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "Hosting",
    tags: ["Green Hosting", "Environment", "Providers"],
    featured: false,
    image: "/placeholder.svg?height=400&width=800&text=Green+Hosting+Guide",
  },
  {
    id: 5,
    title: "AI-Powered Content Generation for Website Analysis",
    excerpt: "Explore how AI can help generate insights and content based on website analysis data.",
    content: `
      <h2>The Rise of AI in Web Analysis</h2>
      <p>Artificial Intelligence is revolutionizing how we analyze and understand website performance. From automated insights to content generation, AI tools are making web analysis more accessible and actionable.</p>
      
      <h2>AI Applications in Website Analysis</h2>
      
      <h3>Automated Performance Insights</h3>
      <p>AI can analyze performance metrics and generate human-readable explanations of issues and recommendations.</p>
      
      <h3>Content Optimization</h3>
      <p>Machine learning algorithms can suggest content improvements based on user behavior and engagement patterns.</p>
      
      <h3>Predictive Analytics</h3>
      <p>AI models can predict future performance trends and potential issues before they impact users.</p>
      
      <h2>Implementation Strategies</h2>
      
      <h3>Data Collection</h3>
      <p>Gather comprehensive data from multiple sources including analytics, performance monitoring, and user feedback.</p>
      
      <h3>Model Training</h3>
      <p>Train AI models on historical data to recognize patterns and generate accurate insights.</p>
      
      <h3>Continuous Learning</h3>
      <p>Implement feedback loops to improve AI recommendations over time.</p>
      
      <h2>Tools and Platforms</h2>
      <ul>
        <li>Google Analytics Intelligence</li>
        <li>Adobe Sensei</li>
        <li>Custom machine learning models</li>
        <li>Natural language processing APIs</li>
      </ul>
      
      <h2>Best Practices</h2>
      <p>Always validate AI-generated insights with human expertise and maintain transparency about AI involvement in analysis.</p>
    `,
    author: "AI Team",
    date: "2024-01-05",
    readTime: "5 min read",
    category: "AI & Technology",
    tags: ["AI", "Content Generation", "Analysis"],
    featured: false,
    image: "/placeholder.svg?height=400&width=800&text=AI+Content+Generation",
  },
  {
    id: 6,
    title: "Website Analysis Best Practices: What to Look For",
    excerpt: "Essential metrics and indicators to focus on when analyzing website performance and user experience.",
    content: `
      <h2>Foundation of Effective Website Analysis</h2>
      <p>Effective website analysis requires understanding which metrics matter most for your specific goals. This comprehensive guide covers the essential indicators every website owner should monitor.</p>
      
      <h2>Performance Metrics</h2>
      
      <h3>Loading Speed</h3>
      <p>Monitor page load times, time to first byte (TTFB), and Core Web Vitals to ensure optimal user experience.</p>
      
      <h3>Resource Optimization</h3>
      <p>Track image sizes, JavaScript bundle sizes, and CSS efficiency to identify optimization opportunities.</p>
      
      <h2>User Experience Indicators</h2>
      
      <h3>Bounce Rate</h3>
      <p>High bounce rates may indicate poor user experience, slow loading times, or irrelevant content.</p>
      
      <h3>Session Duration</h3>
      <p>Longer sessions typically indicate engaging content and good user experience.</p>
      
      <h3>Conversion Rates</h3>
      <p>Track goal completions and conversion funnels to understand user behavior patterns.</p>
      
      <h2>Technical Health</h2>
      
      <h3>Security Assessment</h3>
      <p>Regular security audits, SSL certificate monitoring, and vulnerability scanning.</p>
      
      <h3>SEO Fundamentals</h3>
      <p>Meta tags, structured data, mobile-friendliness, and crawlability checks.</p>
      
      <h3>Accessibility Compliance</h3>
      <p>WCAG guidelines adherence and inclusive design principles.</p>
      
      <h2>Analysis Tools</h2>
      <ul>
        <li>Google Analytics for user behavior</li>
        <li>Google PageSpeed Insights for performance</li>
        <li>GTmetrix for detailed performance analysis</li>
        <li>Lighthouse for comprehensive audits</li>
        <li>WSfynder for all-in-one analysis</li>
      </ul>
      
      <h2>Creating Action Plans</h2>
      <p>Transform analysis results into prioritized action items based on impact and implementation difficulty.</p>
    `,
    author: "Analysis Team",
    date: "2024-01-03",
    readTime: "9 min read",
    category: "Analysis",
    tags: ["Analysis", "Metrics", "Best Practices"],
    featured: false,
    image: "/placeholder.svg?height=400&width=800&text=Website+Analysis+Best+Practices",
  },
]

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

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const postId = Number.parseInt(params.id)
  const post = blogPosts.find((p) => p.id === postId)

  if (!post) {
    notFound()
  }

  const CategoryIcon = getCategoryIcon(post.category)
  const relatedPosts = blogPosts.filter((p) => p.id !== postId && p.category === post.category).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-3">
              {/* Hero Image */}
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900 dark:to-teal-900 rounded-lg mb-8 flex items-center justify-center">
                <CategoryIcon className="h-16 w-16 text-purple-600 dark:text-purple-400" />
              </div>

              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>

                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                  {post.title}
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <SocialShare
                    data={{
                      title: post.title,
                      url: `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${post.id}`,
                      description: post.excerpt,
                    }}
                  />
                </div>
              </div>

              <Separator className="mb-8" />

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:bg-gradient-to-r prose-headings:from-purple-600 prose-headings:to-teal-600 prose-headings:bg-clip-text prose-headings:text-transparent prose-a:text-purple-600 hover:prose-a:text-purple-700 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag.toLowerCase().replace(" ", "-")}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Table of Contents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Table of Contents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2 text-sm">
                    <a href="#introduction" className="block text-purple-600 hover:text-purple-700 transition-colors">
                      Introduction
                    </a>
                    <a href="#key-concepts" className="block text-purple-600 hover:text-purple-700 transition-colors">
                      Key Concepts
                    </a>
                    <a href="#implementation" className="block text-purple-600 hover:text-purple-700 transition-colors">
                      Implementation
                    </a>
                    <a href="#best-practices" className="block text-purple-600 hover:text-purple-700 transition-colors">
                      Best Practices
                    </a>
                    <a href="#conclusion" className="block text-purple-600 hover:text-purple-700 transition-colors">
                      Conclusion
                    </a>
                  </nav>
                </CardContent>
              </Card>

              {/* Author Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=50&width=50" />
                      <AvatarFallback>
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{post.author}</div>
                      <div className="text-sm text-gray-500">WSfynder Team</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expert in website analysis, performance optimization, and sustainable web development practices.
                  </p>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Articles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => {
                        const RelatedIcon = getCategoryIcon(relatedPost.category)
                        return (
                          <Link
                            key={relatedPost.id}
                            href={`/blog/${relatedPost.id}`}
                            className="block group hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
                          >
                            <div className="flex gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900 dark:to-teal-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <RelatedIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm group-hover:text-purple-600 transition-colors line-clamp-2">
                                  {relatedPost.title}
                                </h4>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {relatedPost.readTime}
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Newsletter Signup */}
              <Card className="bg-gradient-to-br from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20">
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                  <CardDescription>Get the latest insights on website optimization and sustainability.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <Button className="w-full">Subscribe to Newsletter</Button>
                    <p className="text-xs text-gray-500 text-center">No spam. Unsubscribe at any time.</p>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>

          {/* Comments Section */}
          <BlogComments postId={params.id} postTitle={post.title} />

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex justify-between items-center">
              <div>
                {postId > 1 && (
                  <Button variant="outline" asChild>
                    <Link href={`/blog/${postId - 1}`} className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Previous Article
                    </Link>
                  </Button>
                )}
              </div>
              <div>
                {postId < blogPosts.length && (
                  <Button variant="outline" asChild>
                    <Link href={`/blog/${postId + 1}`} className="flex items-center gap-2">
                      Next Article
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

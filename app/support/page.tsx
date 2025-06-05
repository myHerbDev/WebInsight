import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Book,
  Users,
  ExternalLink,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I analyze a website?",
        answer:
          "Simply enter the website URL in the analysis form on our homepage. Our system will automatically fetch and analyze the website's performance, security, and sustainability metrics. The analysis typically takes 10-30 seconds to complete.",
      },
      {
        question: "What information do I need to provide?",
        answer:
          "You only need to provide the website URL. Optionally, you can create an account to save your analyses and access additional features like AI content generation and detailed reports.",
      },
      {
        question: "Is there a limit to how many websites I can analyze?",
        answer:
          "Free users can analyze up to 10 websites per day. Premium users have unlimited analyses plus access to advanced features like batch analysis and API access.",
      },
    ],
  },
  {
    category: "Analysis Results",
    questions: [
      {
        question: "What does the sustainability score mean?",
        answer:
          "The sustainability score (0-100%) measures your website's environmental impact based on factors like page size, server efficiency, image optimization, and hosting provider's green credentials. Higher scores indicate better environmental performance.",
      },
      {
        question: "How is the performance score calculated?",
        answer:
          "Performance score considers loading speed, script optimization, image compression, caching efficiency, and overall page weight. It's based on industry best practices and Core Web Vitals metrics.",
      },
      {
        question: "What security aspects are analyzed?",
        answer:
          "We check SSL certificates, security headers (CSP, HSTS, X-Frame-Options), HTTPS implementation, and common security vulnerabilities. The security score reflects your website's protection against common threats.",
      },
      {
        question: "Can I export my analysis results?",
        answer:
          "Yes! You can export results in multiple formats including PDF reports, CSV data, and Markdown. Premium users also get access to branded reports and bulk export options.",
      },
    ],
  },
  {
    category: "Features",
    questions: [
      {
        question: "What is AI content generation?",
        answer:
          "Our AI feature generates various types of content based on your website analysis, including research reports, blog posts, marketing copy, and social media content. It uses your actual analysis data to create relevant, insightful content.",
      },
      {
        question: "How does website comparison work?",
        answer:
          "You can add multiple websites to compare their performance, security, and sustainability metrics side-by-side. The tool shows averages, highlights best performers, and provides actionable insights.",
      },
      {
        question: "What is the hosting provider database?",
        answer:
          "We maintain a comprehensive database of hosting providers with their sustainability ratings, renewable energy usage, performance metrics, and green certifications to help you choose environmentally responsible hosting.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        question: "How accurate are the analysis results?",
        answer:
          "Our analysis uses industry-standard tools and methodologies. Results are highly accurate for publicly accessible websites. Some metrics may vary slightly due to server response times and dynamic content.",
      },
      {
        question: "Why can't some websites be analyzed?",
        answer:
          "Websites may be inaccessible due to: password protection, geographic restrictions, server downtime, or blocking automated requests. We're continuously improving our analysis capabilities.",
      },
      {
        question: "How often should I re-analyze my website?",
        answer:
          "We recommend monthly analysis for active websites, or after major updates. This helps track improvements and identify new optimization opportunities.",
      },
      {
        question: "Do you store my website data?",
        answer:
          "We store analysis results and metadata for your account. We don't store full website content or sensitive information. See our Privacy Policy for complete details.",
      },
    ],
  },
  {
    category: "Account & Billing",
    questions: [
      {
        question: "Do I need an account to use WebInsight?",
        answer:
          "No, you can perform basic website analysis without an account. However, creating an account allows you to save results, access AI features, and export detailed reports.",
      },
      {
        question: "What's included in the premium plan?",
        answer:
          "Premium includes unlimited analyses, AI content generation, advanced export options, API access, priority support, and early access to new features.",
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer:
          "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.",
      },
    ],
  },
]

const supportChannels = [
  {
    title: "Email Support",
    description: "Get detailed help via email",
    icon: Mail,
    contact: "support@webinsight.com",
    responseTime: "Within 24 hours",
    availability: "24/7",
  },
  {
    title: "Live Chat",
    description: "Instant help during business hours",
    icon: MessageSquare,
    contact: "Available in app",
    responseTime: "Within 5 minutes",
    availability: "Mon-Fri 9AM-6PM EST",
  },
  {
    title: "Community Forum",
    description: "Connect with other users",
    icon: Users,
    contact: "community.webinsight.com",
    responseTime: "Community driven",
    availability: "24/7",
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              Support Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Get help with WebInsight features, troubleshoot issues, and find answers to common questions.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search for help..." className="pl-10" />
            </div>
          </div>

          <Tabs defaultValue="faq" className="space-y-8">
            <TabsList className="grid grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Find quick answers to the most common questions about WebInsight.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {faqs.map((category, categoryIndex) => (
                    <Card key={categoryIndex} className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-purple-600" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible>
                          {category.questions.map((faq, faqIndex) => (
                            <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                              <AccordionContent className="text-gray-600 dark:text-gray-400">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* FAQ Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Link
                          href="/docs"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Book className="h-4 w-4 text-blue-500" />
                          <span>Documentation</span>
                          <ArrowRight className="h-3 w-3 ml-auto" />
                        </Link>
                        <Link
                          href="/docs/api"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Book className="h-4 w-4 text-purple-500" />
                          <span>API Reference</span>
                          <ArrowRight className="h-3 w-3 ml-auto" />
                        </Link>
                        <Link
                          href="/blog"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Book className="h-4 w-4 text-teal-500" />
                          <span>Blog & Tutorials</span>
                          <ArrowRight className="h-3 w-3 ml-auto" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Still Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Can't find what you're looking for? Our support team is here to help.
                      </p>
                      <Button className="w-full" asChild>
                        <Link href="#contact">Contact Support</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Choose the best way to reach our support team.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {supportChannels.map((channel, index) => {
                  const Icon = channel.icon
                  return (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <CardTitle className="text-lg">{channel.title}</CardTitle>
                        <CardDescription>{channel.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{channel.responseTime}</span>
                          </div>
                          <div className="font-medium">{channel.availability}</div>
                          <div className="text-purple-600 dark:text-purple-400">{channel.contact}</div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Contact Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">First Name</label>
                          <Input placeholder="John" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Last Name</label>
                          <Input placeholder="Doe" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input type="email" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <Input placeholder="How can we help?" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <Textarea placeholder="Describe your issue or question in detail..." rows={5} />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Response Times</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">General Inquiries</span>
                          <Badge variant="outline">24 hours</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Technical Issues</span>
                          <Badge variant="outline">12 hours</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Billing Questions</span>
                          <Badge variant="outline">6 hours</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Critical Issues</span>
                          <Badge className="bg-red-100 text-red-800">2 hours</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Before You Contact Us</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Check our FAQ section for quick answers</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Review our documentation and guides</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Include specific error messages or screenshots</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Provide the URL you were trying to analyze</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 dark:bg-blue-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        Emergency Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        For critical issues affecting your business, premium users can access our emergency support line
                        at <strong>+1 (555) 123-4567</strong>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Help Resources</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Explore our comprehensive resources to get the most out of WebInsight.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                      <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>Complete guides and API reference</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm mb-4">
                      <li>• Getting started guide</li>
                      <li>• API documentation</li>
                      <li>• Feature explanations</li>
                      <li>• Best practices</li>
                    </ul>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/docs">
                        View Documentation
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                      <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle>Video Tutorials</CardTitle>
                    <CardDescription>Step-by-step video guides</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm mb-4">
                      <li>• Website analysis walkthrough</li>
                      <li>• Using AI content generation</li>
                      <li>• Interpreting results</li>
                      <li>• Advanced features</li>
                    </ul>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/tutorials">
                        Watch Tutorials
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <CardTitle>Community Forum</CardTitle>
                    <CardDescription>Connect with other users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm mb-4">
                      <li>• Ask questions</li>
                      <li>• Share insights</li>
                      <li>• Feature requests</li>
                      <li>• User discussions</li>
                    </ul>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/community">
                        Join Community
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle>Status Page</CardTitle>
                    <CardDescription>Service status and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm mb-4">
                      <li>• Real-time status</li>
                      <li>• Incident reports</li>
                      <li>• Maintenance schedules</li>
                      <li>• Performance metrics</li>
                    </ul>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/status">
                        Check Status
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                      <Book className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle>Blog & Insights</CardTitle>
                    <CardDescription>Latest updates and tutorials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm mb-4">
                      <li>• Feature announcements</li>
                      <li>• Optimization tips</li>
                      <li>• Industry insights</li>
                      <li>• Case studies</li>
                    </ul>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/blog">
                        Read Blog
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                      <HelpCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle>Troubleshooting</CardTitle>
                    <CardDescription>Common issues and solutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm mb-4">
                      <li>• Analysis errors</li>
                      <li>• Performance issues</li>
                      <li>• Account problems</li>
                      <li>• Browser compatibility</li>
                    </ul>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/troubleshooting">
                        View Solutions
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

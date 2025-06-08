import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageSquare, Users, Zap } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact WSfynder | Get Support & Sales Information",
  description:
    "Contact WSfynder for support, sales inquiries, partnerships, or general questions. We're here to help with your website analysis needs.",
}

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help with technical issues or general questions",
    contact: "support@wsfynder.com",
    responseTime: "Within 24 hours",
  },
  {
    icon: MessageSquare,
    title: "Sales Inquiries",
    description: "Learn about enterprise plans and custom solutions",
    contact: "sales@wsfynder.com",
    responseTime: "Within 4 hours",
  },
  {
    icon: Users,
    title: "Partnerships",
    description: "Explore partnership and integration opportunities",
    contact: "partnerships@wsfynder.com",
    responseTime: "Within 48 hours",
  },
  {
    icon: Zap,
    title: "Media & Press",
    description: "Press inquiries and media kit requests",
    contact: "press@wsfynder.com",
    responseTime: "Within 24 hours",
  },
]

const officeInfo = [
  {
    icon: MapPin,
    title: "Headquarters",
    details: ["123 Tech Street", "San Francisco, CA 94105", "United States"],
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+1 (555) 123-4567", "Monday - Friday", "9:00 AM - 6:00 PM PST"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Monday - Friday: 9:00 AM - 6:00 PM PST", "Saturday: 10:00 AM - 4:00 PM PST", "Sunday: Closed"],
  },
]

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about WSfynder? We're here to help. Reach out to our team for support, sales, or
            partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" placeholder="Your Company" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="sales">Sales Question</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Choose the best way to reach us based on your needs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <method.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{method.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">{method.description}</p>
                      <p className="text-sm font-medium text-primary">{method.contact}</p>
                      <p className="text-xs text-muted-foreground">{method.responseTime}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Information */}
            <Card>
              <CardHeader>
                <CardTitle>Office Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {officeInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{info.title}</h4>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/docs" target="_blank" rel="noreferrer">
                    📚 Documentation
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/status" target="_blank" rel="noreferrer">
                    🟢 System Status
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/community" target="_blank" rel="noreferrer">
                    💬 Community Forum
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/tutorials" target="_blank" rel="noreferrer">
                    🎓 Tutorials
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions. Can't find what you're looking for? Contact us directly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">How quickly do you respond to support requests?</h4>
                <p className="text-sm text-muted-foreground">
                  We typically respond to support requests within 24 hours during business days. Premium users receive
                  priority support with faster response times.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Do you offer custom enterprise solutions?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! We offer custom enterprise solutions including white-label options, API access, and dedicated
                  support. Contact our sales team for more information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Can I schedule a demo?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer personalized demos for teams and enterprises. Contact our sales team to schedule a demo that
                  fits your needs.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Do you have an API?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, we offer a comprehensive API for enterprise customers. Our API allows you to integrate WSfynder's
                  analysis capabilities into your own applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

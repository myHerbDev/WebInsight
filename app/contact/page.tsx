"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Mail, MessageSquare, Github, ExternalLink, Send, MapPin, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message Sent!",
      description: "Thank you for your message. We'll get back to you soon.",
    })

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
    setIsSubmitting(false)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      value: "hello@myherb.co.il",
      action: "mailto:hello@myherb.co.il",
    },
    {
      icon: Github,
      title: "GitHub Issues",
      description: "Report bugs or request features on our GitHub repository",
      value: "GitHub Repository",
      action: "https://github.com/myHerbDev/websight-analyzer",
    },
    {
      icon: ExternalLink,
      title: "Website",
      description: "Visit our main website for more information",
      value: "myherb.co.il",
      action: "https://myherb.co.il",
    },
  ]

  const faqs = [
    {
      question: "How accurate are the website analysis results?",
      answer:
        "Our AI-powered analysis provides highly accurate insights based on industry standards and best practices. However, results should be used as guidance and may require human interpretation for specific contexts.",
    },
    {
      question: "Is there a limit to how many websites I can analyze?",
      answer:
        "Currently, there are no strict limits for individual analyses. However, we may implement rate limiting to ensure fair usage and optimal performance for all users.",
    },
    {
      question: "Do you store the websites I analyze?",
      answer:
        "We temporarily store website data during analysis to generate reports. This data is automatically deleted after 30 days. See our Privacy Policy for more details.",
    },
    {
      question: "Can I use WebInSight for commercial purposes?",
      answer:
        "Yes, WebInSight can be used for both personal and commercial website analysis. Please review our Terms of Service for specific usage guidelines.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Have questions about WebInSight? Need support? Want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-3 text-primary-gradient-start" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        className="bg-slate-50/80 dark:bg-slate-800/80"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="bg-slate-50/80 dark:bg-slate-800/80"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      className="bg-slate-50/80 dark:bg-slate-800/80"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="bg-slate-50/80 dark:bg-slate-800/80"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-gradient hover:opacity-90 text-white"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <MapPin className="h-5 w-5 mr-3 text-primary-gradient-start shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm">Israel</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <Clock className="h-5 w-5 mr-3 text-primary-gradient-start shrink-0" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm">Within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <Mail className="h-5 w-5 mr-3 text-primary-gradient-start shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm">hello@myherb.co.il</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <Card
                      key={index}
                      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-primary-gradient rounded-lg flex items-center justify-center mr-4 shrink-0">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{method.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{method.description}</p>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="border-primary-gradient-start/30 text-primary-gradient-start hover:bg-primary-gradient-start/10"
                            >
                              <a
                                href={method.action}
                                target={method.action.startsWith("http") ? "_blank" : undefined}
                                rel={method.action.startsWith("http") ? "noopener noreferrer" : undefined}
                              >
                                {method.value}
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{faq.question}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

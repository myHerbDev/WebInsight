"use client"

import Link from "next/link"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Mail, MessageSquare, HelpCircle, Briefcase } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("") // For select component

  // Pre-fill subject from query params
  if (typeof window !== "undefined") {
    const queryParams = new URLSearchParams(window.location.search)
    const subjectFromQuery = queryParams.get("subject")
    if (subjectFromQuery && !selectedSubject && !formData.subject) {
      // Use selectedSubject for the Select, formData.subject for the input
      setSelectedSubject(subjectFromQuery)
      setFormData((prev) => ({ ...prev, subject: subjectFromQuery }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value)
    setFormData({ ...formData, subject: value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you as soon as possible.",
    })
    setFormData({ name: "", email: "", subject: "", message: "" })
    setSelectedSubject("")
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Contact Us
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Have a question, feedback, or a project in mind? We'd love to hear from you.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-select">Subject</Label>
                  <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                    <SelectTrigger id="subject-select">
                      <SelectValue placeholder="Select a subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                      <SelectItem value="Support Request">Support Request</SelectItem>
                      <SelectItem value="Feedback">Feedback & Suggestions</SelectItem>
                      <SelectItem value="Partnership">Partnership Opportunities</SelectItem>
                      <SelectItem value="EnterpriseInquiry">Enterprise Plan Inquiry</SelectItem>
                      <SelectItem value="Application: Senior Frontend Engineer">
                        Application: Senior Frontend Engineer
                      </SelectItem>
                      <SelectItem value="Application: AI/ML Engineer">Application: AI/ML Engineer</SelectItem>
                      <SelectItem value="IntegrationRequest">Integration Request</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedSubject === "Other" && (
                    <Input
                      id="subject-text"
                      name="subject"
                      placeholder="Please specify your subject"
                      value={formData.subject === "Other" ? "" : formData.subject} // Clear if "Other" was just selected
                      onChange={handleChange}
                      className="mt-2"
                      required
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>
                Visit our{" "}
                <Link href="/support" className="text-primary hover:underline">
                  Support Center
                </Link>{" "}
                for FAQs and guides.
              </p>
              <p>
                Check our{" "}
                <Link href="/docs" className="text-primary hover:underline">
                  Documentation
                </Link>{" "}
                for technical details.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Join the discussion in our{" "}
                <Link href="/community" className="text-primary hover:underline">
                  Community Forum
                </Link>
                .
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Briefcase className="mr-2 h-5 w-5 text-primary" />
                Careers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Interested in joining our team? View{" "}
                <Link href="/careers" className="text-primary hover:underline">
                  open positions
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Target, Zap, Heart, Globe, Shield } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About WSfynder | Intelligent Website Analysis Platform",
  description:
    "Learn about WSfynder's mission to provide intelligent website analysis and AI-powered content generation. Discover our story, values, and commitment to web optimization.",
}

const teamMembers = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Former Google engineer with 10+ years in web performance optimization.",
    image: "/placeholder-user.jpg",
  },
  {
    name: "Sarah Rodriguez",
    role: "CTO",
    bio: "AI/ML expert specializing in natural language processing and web analytics.",
    image: "/placeholder-user.jpg",
  },
  {
    name: "Mike Johnson",
    role: "Head of Product",
    bio: "UX designer and product strategist focused on developer tools.",
    image: "/placeholder-user.jpg",
  },
  {
    name: "Emily Davis",
    role: "Lead Developer",
    bio: "Full-stack developer passionate about performance and accessibility.",
    image: "/placeholder-user.jpg",
  },
]

const values = [
  {
    icon: Target,
    title: "Accuracy",
    description: "We provide precise, reliable analysis backed by industry-standard metrics and best practices.",
  },
  {
    icon: Zap,
    title: "Speed",
    description: "Fast analysis and instant insights to help you optimize your website without delay.",
  },
  {
    icon: Shield,
    title: "Privacy",
    description: "Your data is secure. We analyze websites without storing sensitive information.",
  },
  {
    icon: Heart,
    title: "User-Centric",
    description: "Every feature is designed with user experience and practical value in mind.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making web optimization tools accessible to everyone, regardless of technical expertise.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a community of developers and website owners focused on web excellence.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              About WSfynder
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to make website optimization accessible, intelligent, and actionable for everyone.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              WSfynder was born from the frustration of using complex, expensive tools to analyze website performance.
              We believe that every website owner, developer, and digital marketer should have access to
              professional-grade analysis tools without the complexity or cost barriers.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              Our platform combines cutting-edge AI technology with comprehensive web analysis to provide actionable
              insights that actually help improve websites. We're not just about numbers – we're about making the web
              faster, more secure, and more accessible for everyone.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <p>
                WSfynder started in 2023 when our founder, Alex Chen, was working as a web performance consultant. Time
                and again, clients would ask for simple, actionable insights about their websites, but existing tools
                were either too complex, too expensive, or provided data without context.
              </p>
              <p>
                The breakthrough came when we realized that AI could bridge the gap between raw data and actionable
                insights. By combining comprehensive website analysis with intelligent content generation, we could
                provide not just the "what" but also the "how" and "why" of website optimization.
              </p>
              <p>
                Today, WSfynder serves thousands of users worldwide, from individual bloggers to enterprise development
                teams. We're proud to be making professional-grade website analysis accessible to everyone.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-primary font-medium mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card className="mb-12 bg-gradient-to-r from-purple-50 to-green-50 border-0">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">WSfynder by the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Websites Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100+</div>
                <div className="text-sm text-muted-foreground">Data Points</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your Website?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who trust WSfynder for intelligent website analysis and optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                <Link href="/">Start Free Analysis</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

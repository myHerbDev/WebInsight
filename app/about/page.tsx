import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Users, Heart, Globe, Zap, Shield, BarChart3, Brain, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Websites Analyzed", value: "10,000+", icon: Globe },
  { label: "Data Points Collected", value: "50+", icon: BarChart3 },
  { label: "AI Content Generated", value: "5,000+", icon: Brain },
  { label: "User Satisfaction", value: "99%", icon: Star },
]

const values = [
  {
    icon: Target,
    title: "Precision",
    description: "We deliver accurate, comprehensive website analysis with attention to every detail.",
  },
  {
    icon: Zap,
    title: "Speed",
    description: "Lightning-fast analysis that provides insights in seconds, not minutes.",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Your data and privacy are our top priority with enterprise-grade security.",
  },
  {
    icon: Heart,
    title: "User-Centric",
    description: "Every feature is designed with our users' needs and experience in mind.",
  },
]

const milestones = [
  {
    year: "2024",
    title: "WSfynder Launch",
    description: "Launched with comprehensive website analysis and AI content generation capabilities.",
  },
  {
    year: "2024",
    title: "AI Integration",
    description: "Integrated advanced AI models for intelligent content generation and analysis.",
  },
  {
    year: "2024",
    title: "Performance Optimization",
    description: "Achieved sub-second analysis times with parallel processing architecture.",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4">
          About WSfynder
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Intelligent Website Discovery
          <span className="text-primary"> Redefined</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          WSfynder is the next-generation platform for website analysis and content generation, combining cutting-edge
          AI technology with comprehensive data insights to help you understand and optimize any website on the
          internet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/">Start Analysis</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/features">Explore Features</Link>
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            At WSfynder, we believe that understanding websites shouldn't be complicated or time-consuming. Our mission
            is to democratize website intelligence by providing powerful, AI-driven analysis tools that anyone can use
            to gain deep insights into any website's performance, security, and optimization opportunities.
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We're building the future of website analysis, where comprehensive insights are just a click away, and where
            AI-powered content generation transforms raw data into actionable intelligence.
          </p>
          <Button asChild>
            <Link href="/content-studio">
              Try AI Content Studio <Brain className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
            <div className="w-full h-full bg-background rounded-xl shadow-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Global Website Intelligence</h3>
                <p className="text-sm text-muted-foreground">Analyzing websites worldwide with AI-powered precision</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do at WSfynder
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Key milestones in WSfynder's development and growth</p>
        </div>
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {milestone.year.slice(-2)}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                <p className="text-muted-foreground">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <Card className="mb-16">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Powered by Advanced Technology</CardTitle>
          <CardDescription>
            WSfynder leverages cutting-edge technologies to deliver unparalleled website analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">AI & Machine Learning</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI models for content generation and intelligent analysis
              </p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">High-Performance Computing</h3>
              <p className="text-sm text-muted-foreground">Parallel processing for lightning-fast website analysis</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">Bank-grade security to protect your data and privacy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Discover Website Intelligence?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who trust WSfynder for comprehensive website analysis and AI-powered content
          generation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/">
              Start Free Analysis <TrendingUp className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">
              Contact Us <Users className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

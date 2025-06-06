import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Leaf, Zap, Users, Target, Heart, Github, BookOpen, Rocket, Handshake, Award, Star } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced artificial intelligence analyzes your website's performance, SEO, and content strategy with precision.",
    },
    {
      icon: Leaf,
      title: "Sustainability Focus",
      description:
        "Comprehensive environmental impact assessment including carbon footprint and green hosting recommendations.",
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description:
        "Detailed performance metrics and actionable recommendations to boost your website's speed and efficiency.",
    },
    {
      icon: Users,
      title: "User Experience",
      description: "In-depth UX analysis to improve visitor engagement and conversion rates across all devices.",
    },
  ]

  const team = [
    {
      name: "myHerb Development Team",
      role: "Full-Stack Development & AI Integration",
      description: "Passionate developers focused on creating innovative web solutions that make a positive impact.",
    },
  ]

  const technologies = [
    "Next.js 15",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "Groq AI",
    "Vercel",
    "Neon Database",
    "shadcn/ui",
  ]

  const timelineEvents = [
    {
      icon: BookOpen,
      date: "Phase 1: The Genesis",
      title: "From a Single Blog to a Vision",
      description:
        "myHerb began as a personal blog, a space for sharing knowledge and passion. This humble beginning laid the foundation for a much larger vision: to build a robust digital agency.",
    },
    {
      icon: Rocket,
      date: "Phase 2: Solo Development",
      title: "The Journey of Self-Reliance",
      description:
        "Driven by determination, our founder embarked on a journey of learning development alone, mastering the skills needed to turn a vision into a tangible, high-impact reality.",
    },
    {
      icon: Handshake,
      date: "Phase 3: Building Networks",
      title: "Forging a Wise Network of Partners",
      description:
        "Growth accelerated as myHerb cultivated a strong network of strategic partners, transforming from a solo venture into a collaborative agency powerhouse.",
    },
    {
      icon: Award,
      date: "Phase 4: Enterprise Partnerships",
      title: "Achieving Major Milestones",
      description:
        "A pivotal moment was reached with partnerships from industry giants like PayPal, Atlassian, Google Play, Microsoft, Wrike, MongoDB, Mixpanel, and Segment.",
    },
    {
      icon: Star,
      date: "Phase 5: Industry Recognition",
      title: "Validation and Influence",
      description:
        "Our expertise and partner network were recognized with a total score of 98 on Partnerbase.com. Today, myHerb's influence spans major publishing networks and thrives on LinkedIn.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-6">
              About WebInSight
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              WebInSight is an AI-powered website analysis platform that helps developers, marketers, and business
              owners optimize their web presence for performance, sustainability, and user experience.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Target className="h-6 w-6 mr-3 text-primary-gradient-start" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              <p className="mb-4">
                We believe that every website should be fast, accessible, and environmentally responsible. Our mission
                is to democratize advanced web analysis tools, making them accessible to everyone from individual
                developers to enterprise teams.
              </p>
              <p>
                By combining cutting-edge AI technology with comprehensive sustainability metrics, we're helping build a
                better, greener web that serves both users and our planet.
              </p>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-slate-200">
              What Makes WebInSight Special
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={index}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Icon className="h-5 w-5 mr-3 text-primary-gradient-start" />
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Technology Stack */}
          <Card className="mb-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Zap className="h-6 w-6 mr-3 text-primary-gradient-start" />
                Built with Modern Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                WebInSight is built using the latest web technologies to ensure optimal performance, scalability, and
                user experience.
              </p>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-primary-gradient-start/10 border-primary-gradient-start/30"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Section */}
          <Card className="mb-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Users className="h-6 w-6 mr-3 text-primary-gradient-start" />
                The Team Behind WebInSight
              </CardTitle>
            </CardHeader>
            <CardContent>
              {team.map((member, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">{member.name}</h3>
                  <p className="text-primary-gradient-start font-medium mb-2">{member.role}</p>
                  <p className="text-slate-600 dark:text-slate-400">{member.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card className="mb-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Heart className="h-6 w-6 mr-3 text-primary-gradient-start" />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Sustainability</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Promoting environmentally responsible web practices and green hosting solutions.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Innovation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Leveraging cutting-edge AI to provide insights that drive meaningful improvements.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Accessibility</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Making advanced web analysis tools available to developers and businesses of all sizes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline/Roadmap Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-10 text-slate-800 dark:text-slate-200">Our Journey</h2>
            <div className="relative">
              {/* The vertical line */}
              <div
                className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-primary-gradient-start via-primary-gradient-middle to-primary-gradient-end"
                aria-hidden="true"
              ></div>

              <div className="space-y-12">
                {timelineEvents.map((event, index) => {
                  const Icon = event.icon
                  return (
                    <div key={index} className="relative pl-16">
                      <div className="absolute left-0 top-1 flex items-center">
                        <div className="w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center ring-8 ring-background">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-gradient-start mb-1">{event.date}</p>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{event.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{event.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Open Source Sponsorship Section */}
          <Card className="mb-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Heart className="h-6 w-6 mr-3 text-primary-gradient-start" />
                Supporting a Sustainable Future
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                We are proud to support open-source development focused on sustainability through our two sponsor
                accounts. This initiative, the{" "}
                <span className="font-semibold text-primary-gradient-start">Free-style Collaborative Hub</span>,
                empowers developers to create innovative solutions for a greener web.
              </p>
              <div className="flex gap-4">
                <Button asChild variant="outline">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Sponsor Account 1
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Sponsor Account 2
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Ready to Optimize Your Website?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Join thousands of developers and businesses who trust WebInSight to improve their web presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-primary-gradient hover:opacity-90 text-white">
                <Link href="/">Start Analysis</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-gradient-start/30 text-primary-gradient-start hover:bg-primary-gradient-start/10"
              >
                <a href="https://github.com/myHerbDev/websight-analyzer" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

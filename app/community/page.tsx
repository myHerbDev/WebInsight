import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MessageSquare, Users, BookOpen, Github, Twitter, ExternalLink, Heart, Star } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WSfynder Community | Connect with Developers & Website Owners",
  description:
    "Join the WSfynder community. Connect with developers, share insights, get help, and contribute to making the web better.",
}

const communityChannels = [
  {
    name: "Discord Server",
    description: "Real-time chat with the community and team",
    members: "2,500+",
    icon: MessageSquare,
    link: "https://discord.gg/wsfynder",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "GitHub Discussions",
    description: "Feature requests, bug reports, and technical discussions",
    members: "1,200+",
    icon: Github,
    link: "https://github.com/wsfynder/discussions",
    color: "from-gray-700 to-gray-900",
  },
  {
    name: "Reddit Community",
    description: "Share insights, tips, and website optimization stories",
    members: "5,800+",
    icon: Users,
    link: "https://reddit.com/r/wsfynder",
    color: "from-orange-500 to-red-600",
  },
  {
    name: "Twitter",
    description: "Latest updates, tips, and community highlights",
    members: "8,200+",
    icon: Twitter,
    link: "https://twitter.com/wsfynder",
    color: "from-blue-400 to-blue-600",
  },
]

const resources = [
  {
    title: "Documentation",
    description: "Comprehensive guides and API documentation",
    icon: BookOpen,
    link: "/docs",
    badge: "Updated",
  },
  {
    title: "Tutorials",
    description: "Step-by-step tutorials for website optimization",
    icon: BookOpen,
    link: "/tutorials",
    badge: "Popular",
  },
  {
    title: "Blog",
    description: "Latest insights on web performance and SEO",
    icon: BookOpen,
    link: "/blog",
    badge: "Weekly",
  },
  {
    title: "Changelog",
    description: "Latest features and improvements",
    icon: BookOpen,
    link: "/changelog",
    badge: "New",
  },
]

const contributors = [
  {
    name: "Alex Chen",
    role: "Founder & Lead Developer",
    avatar: "/placeholder-user.jpg",
    contributions: "Core platform development",
  },
  {
    name: "Sarah Rodriguez",
    role: "AI/ML Engineer",
    avatar: "/placeholder-user.jpg",
    contributions: "Content generation algorithms",
  },
  {
    name: "Mike Johnson",
    role: "Community Manager",
    avatar: "/placeholder-user.jpg",
    contributions: "Community building and support",
  },
  {
    name: "Emily Davis",
    role: "Frontend Developer",
    avatar: "/placeholder-user.jpg",
    contributions: "UI/UX improvements",
  },
]

const events = [
  {
    title: "Monthly Community Call",
    date: "Every 3rd Thursday",
    time: "2:00 PM PST",
    description:
      "Join our monthly community call to discuss new features, share feedback, and connect with other users.",
    type: "Recurring",
  },
  {
    title: "Web Performance Workshop",
    date: "February 15, 2024",
    time: "10:00 AM PST",
    description: "Learn advanced website optimization techniques with our team of experts.",
    type: "Workshop",
  },
  {
    title: "WSfynder Conference 2024",
    date: "March 20-21, 2024",
    time: "All Day",
    description: "Our annual conference featuring talks from industry experts and community members.",
    type: "Conference",
  },
]

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              Join Our Community
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with developers, website owners, and optimization experts. Share knowledge, get help, and help make
            the web better.
          </p>
        </div>

        {/* Community Stats */}
        <Card className="mb-12 bg-gradient-to-r from-purple-50 to-green-50 border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">18K+</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Daily Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">1.2K+</div>
                <div className="text-sm text-muted-foreground">Questions Answered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Channels */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Community Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityChannels.map((channel, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${channel.color} flex items-center justify-center`}
                      >
                        <channel.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <CardDescription>{channel.members} members</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={channel.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{channel.description}</p>
                  <Button asChild className="w-full">
                    <a href={channel.link} target="_blank" rel="noopener noreferrer">
                      Join {channel.name}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Community Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <resource.icon className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{resource.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{resource.description}</CardDescription>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={resource.link}>Explore</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Top Contributors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributors.map((contributor, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={contributor.avatar || "/placeholder.svg"}
                    alt={contributor.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h4 className="font-semibold mb-1">{contributor.name}</h4>
                  <p className="text-sm text-primary mb-2">{contributor.role}</p>
                  <p className="text-xs text-muted-foreground">{contributor.contributions}</p>
                  <div className="flex justify-center mt-3">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
          <div className="space-y-4">
            {events.map((event, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{event.title}</h4>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                      <div className="text-sm text-muted-foreground">
                        <span>📅 {event.date}</span>
                        <span className="mx-2">•</span>
                        <span>🕐 {event.time}</span>
                      </div>
                    </div>
                    <Button variant="outline">Register</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Community Guidelines</CardTitle>
            <CardDescription>Help us maintain a welcoming and productive community for everyone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Be Respectful
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Treat all community members with respect</li>
                  <li>• Use inclusive language</li>
                  <li>• Be patient with beginners</li>
                  <li>• Avoid personal attacks or harassment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  Be Helpful
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Share knowledge and resources</li>
                  <li>• Provide constructive feedback</li>
                  <li>• Help others solve problems</li>
                  <li>• Contribute to discussions meaningfully</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  Stay On Topic
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep discussions relevant to web optimization</li>
                  <li>• Use appropriate channels for different topics</li>
                  <li>• Search before asking questions</li>
                  <li>• Provide context when asking for help</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Quality Content
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Share high-quality resources</li>
                  <li>• Avoid spam or self-promotion</li>
                  <li>• Use clear and descriptive titles</li>
                  <li>• Follow platform-specific guidelines</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h3>
            <p className="text-muted-foreground mb-6">
              Connect with thousands of developers and website owners who are passionate about web optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              >
                <a href="https://discord.gg/wsfynder" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </a>
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

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MessageSquare, Users, Lightbulb, HelpCircle, Code } from "lucide-react"
import Link from "next/link"

const forumCategories = [
  {
    name: "General Discussion",
    icon: MessageSquare,
    description: "Talk about anything related to WScrapierr, web scraping, or AI content generation.",
    link: "#general", // Placeholder link, would point to actual forum category
  },
  {
    name: "Feature Requests",
    icon: Lightbulb,
    description: "Have an idea for a new feature? Share it with the community and our team.",
    link: "#features",
  },
  {
    name: "Show & Tell",
    icon: Users,
    description: "Showcase how you're using WScrapierr or interesting findings from your analyses.",
    link: "#showcase",
  },
  {
    name: "Troubleshooting & Support",
    icon: HelpCircle,
    description: "Get help from the community or share solutions to common issues.",
    link: "#support",
  },
  {
    name: "Developer Chat",
    icon: Code,
    description: "Discuss API usage, custom integrations, and technical aspects of WScrapierr.",
    link: "#devchat",
  },
]

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            WScrapierr Community Forum
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with fellow WScrapierr users, share insights, ask questions, and help shape the future of our
          platform.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
          >
            {/* This link would ideally go to an external forum platform or a dedicated forum section */}
            <Link href="#join-forum">Join the Discussion (Coming Soon)</Link>
          </Button>
        </div>
      </header>

      <section className="mb-12 md:mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">Forum Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forumCategories.map((category) => (
            <Card key={category.name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-3">
                <category.icon className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{category.description}</CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-3 text-sm">
                  <Link href={category.link}>Go to category &rarr;</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted p-8 md:p-12 rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Community Guidelines</h2>
        <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
          <p>To ensure a positive and productive environment for everyone, please adhere to these guidelines:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Be respectful and considerate of others.</li>
            <li>Stay on topic within forum categories.</li>
            <li>Do not share private or sensitive information.</li>
            <li>No spamming or excessive self-promotion.</li>
            <li>Contribute constructively to discussions.</li>
          </ul>
          <p className="text-sm">
            Violations may result in post removal or account suspension. Let's build a great community together!
          </p>
        </div>
      </section>
    </div>
  )
}

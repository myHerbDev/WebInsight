import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, FileText, Users, Settings } from "lucide-react"

const integrationCategories = [
  {
    name: "Content Platforms",
    icon: FileText,
    integrations: [
      { name: "WordPress", description: "Publish generated articles directly to your WordPress blog." },
      { name: "Medium", description: "Draft and share insights on Medium seamlessly." },
      { name: "Ghost", description: "Integrate with your Ghost publication for easy content updates." },
    ],
  },
  {
    name: "Analytics & SEO Tools",
    icon: BarChart,
    integrations: [
      { name: "Google Analytics", description: "Correlate WSfynder insights with your site traffic data." },
      { name: "Semrush (Planned)", description: "Combine keyword research with WSfynder's content analysis." },
      { name: "Ahrefs (Planned)", description: "Enhance backlink and competitor analysis." },
    ],
  },
  {
    name: "Collaboration & Productivity",
    icon: Users,
    integrations: [
      { name: "Slack", description: "Receive notifications for completed analyses or important updates." },
      { name: "Google Drive", description: "Save generated documents and reports directly to Drive." },
      { name: "Notion", description: "Organize research and content within your Notion workspace." },
    ],
  },
  {
    name: "Developer Tools",
    icon: Settings,
    integrations: [
      { name: "Zapier", description: "Connect WSfynder to thousands of other apps with custom workflows." },
      {
        name: "Make (Integromat)",
        description: "Automate tasks and data transfer between WSfynder and other services.",
      },
      { name: "WScrapierr API", description: "Build custom solutions and integrate our data into your applications." },
    ],
  },
]

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            WSfynder Integrations
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect WSfynder with your favorite tools and platforms to streamline your workflow and enhance your
          productivity.
        </p>
      </header>

      <div className="space-y-12">
        {integrationCategories.map((category) => (
          <section key={category.name}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
              <category.icon className="h-7 w-7 mr-3 text-primary" />
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.integrations.map((integration) => (
                <Card key={integration.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{integration.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                    {/* Placeholder for a "Connect" button or status indicator */}
                    <div className="mt-4 text-xs text-primary/80">
                      {integration.name.includes("(Planned)") ? "Coming Soon" : "Learn More"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 md:mt-24 text-center">
        <h2 className="text-3xl font-semibold mb-4">Don't See Your Tool?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          We're always expanding our list of integrations. Let us know what tools you'd love to see WSfynder connect
          with!
        </p>
        {/* <Button asChild>
          <Link href="/contact?subject=IntegrationRequest">Request an Integration</Link>
        </Button> */}
      </section>
    </div>
  )
}

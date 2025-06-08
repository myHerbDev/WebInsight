import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Zap, Shield, Users, BarChart, Bot } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Blazing Fast Analysis",
    description:
      "Get comprehensive website insights in seconds, not minutes. Our optimized engine ensures rapid data extraction and processing.",
    details: [
      "Parallel processing for multiple checks.",
      "Lightweight data fetching techniques.",
      "Efficient parsing algorithms.",
    ],
  },
  {
    icon: BarChart,
    title: "In-Depth Website Audits",
    description:
      "Go beyond surface-level checks. WScrapierr dives deep into SEO, performance, security, technologies, and more.",
    details: [
      "Content structure and keyword analysis.",
      "Core Web Vitals and performance bottlenecks.",
      "Security header and vulnerability scanning (basic).",
    ],
  },
  {
    icon: Bot,
    title: "AI-Powered Content Generation",
    description: "Transform analyzed data into various content formats using our advanced AI Content Studio.",
    details: [
      "Blog posts, articles, summaries, and reports.",
      "Customizable tone and style.",
      "Leverages insights from website analysis.",
    ],
  },
  {
    icon: Shield,
    title: "Hosting & Domain Insights",
    description: "Understand where a website is hosted, its IP details, and basic domain registration information.",
    details: ["Hosting provider detection.", "Server location (estimated).", "Basic domain age and registrar info."],
  },
  {
    icon: Users,
    title: "User-Friendly Interface",
    description:
      "Navigate complex data effortlessly with our intuitive, Google-inspired design and clear visualizations.",
    details: ["Clean, minimalist aesthetic.", "Responsive design for all devices.", "Easy-to-understand reports."],
  },
  {
    icon: CheckCircle,
    title: "Comprehensive Reporting",
    description: "Access detailed reports with actionable insights, presented in an organized and digestible format.",
    details: [
      "Tabbed navigation for different analysis aspects.",
      "Clear scoring and recommendations.",
      "Data export options (planned).",
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            WScrapierr Features
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the powerful capabilities WScrapierr offers to analyze, understand, and generate content from any
          website.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {feature.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-16 md:mt-24 text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Experience the magic of WScrapierr. Analyze your first website today and unlock a new level of web
          intelligence.
        </p>
        {/* <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90">
          <Link href="/">Analyze a Website</Link>
        </Button> */}
      </section>
    </div>
  )
}

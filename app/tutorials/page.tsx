import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, Search, Lightbulb, BarChart, Bot, Settings } from "lucide-react"
import Link from "next/link"

// Mark as client component if using useState
// "use client";

const tutorials = [
  {
    title: "Getting Started with WScrapierr: Your First Analysis",
    category: "Basics",
    icon: PlayCircle,
    description: "Learn how to perform your first website analysis and understand the core results.",
    duration: "5 min read",
    link: "/docs/getting-started", // Link to a more detailed doc page
    tags: ["beginner", "analysis", "overview"],
  },
  {
    title: "Understanding SEO Metrics in WScrapierr",
    category: "SEO",
    icon: Search,
    description: "A deep dive into the SEO-related data WScrapierr provides and how to interpret it.",
    duration: "8 min read",
    link: "/docs/seo-metrics",
    tags: ["seo", "keywords", "content"],
  },
  {
    title: "Optimizing Website Performance with WScrapierr Insights",
    category: "Performance",
    icon: BarChart,
    description: "Identify performance bottlenecks and learn how to use WScrapierr data to speed up your site.",
    duration: "10 min read",
    link: "/docs/performance-optimization",
    tags: ["performance", "speed", "core web vitals"],
  },
  {
    title: "Mastering AI Content Generation",
    category: "AI Content",
    icon: Bot,
    description: "Tips and tricks for generating high-quality content using the WScrapierr AI Content Studio.",
    duration: "12 min read",
    link: "/docs/ai-content-studio",
    tags: ["ai", "content creation", "prompts"],
  },
  {
    title: "Advanced Scraping Techniques (Conceptual)",
    category: "Advanced",
    icon: Settings,
    description:
      "Explore conceptual approaches to more complex scraping scenarios (Note: WScrapierr uses automated analysis).",
    duration: "7 min read",
    link: "/docs/advanced-scraping",
    tags: ["scraping", "data extraction", "technical"],
  },
  {
    title: "Interpreting Security Reports",
    category: "Security",
    icon: Lightbulb, // Using Lightbulb as Shield is used elsewhere
    description: "Understand the security information provided by WScrapierr and common vulnerabilities.",
    duration: "6 min read",
    link: "/docs/security-reports",
    tags: ["security", "https", "vulnerabilities"],
  },
]

export default function TutorialsPage() {
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("All");

  // const filteredTutorials = tutorials.filter(tutorial => {
  //   const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  //   const matchesCategory = selectedCategory === "All" || tutorial.category === selectedCategory;
  //   return matchesSearch && matchesCategory;
  // });

  // const categories = ["All", ...new Set(tutorials.map(t => t.category))];

  // This page is static for now, filtering would require "use client"
  const filteredTutorials = tutorials

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            WScrapierr Tutorials
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn how to make the most of WScrapierr with our step-by-step guides and expert tips.
        </p>
      </header>

      {/* Search and Filter Section - requires "use client"
      <div className="mb-10 flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="search"
          placeholder="Search tutorials..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      */}

      {filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.title} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <tutorial.icon className="h-7 w-7 text-primary flex-shrink-0" />
                  <CardTitle className="text-xl leading-tight">{tutorial.title}</CardTitle>
                </div>
                <CardDescription>{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div className="text-xs text-muted-foreground mb-3">
                  <span>{tutorial.category}</span> &bull; <span>{tutorial.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {tutorial.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" asChild className="w-full mt-auto">
                  <Link href={tutorial.link}>Read Tutorial</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg">
          No tutorials found matching your criteria. Try broadening your search.
        </p>
      )}

      <section className="mt-16 md:mt-24 text-center">
        <h2 className="text-3xl font-semibold mb-4">Need More Help?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          If you can't find what you're looking for, check out our{" "}
          <Link href="/docs" className="text-primary hover:underline">
            Documentation
          </Link>{" "}
          or{" "}
          <Link href="/support" className="text-primary hover:underline">
            contact our support team
          </Link>
          .
        </p>
      </section>
    </div>
  )
}

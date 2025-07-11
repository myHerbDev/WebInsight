import { NextResponse } from "next/server"

const blogPosts = [
  {
    id: 1,
    title: "The Complete Guide to Website Sustainability in 2024",
    excerpt:
      "Learn how to reduce your website's carbon footprint and improve environmental impact with practical optimization techniques.",
    author: "myHerb Team",
    date: "2024-01-15",
    category: "Sustainability",
    tags: ["Green Web", "Performance", "Environment"],
  },
  {
    id: 2,
    title: "Understanding Website Security Headers: A Developer's Guide",
    excerpt:
      "Comprehensive overview of security headers and how they protect your website from common vulnerabilities.",
    author: "Security Team",
    date: "2024-01-12",
    category: "Security",
    tags: ["Security", "Headers", "Best Practices"],
  },
  {
    id: 3,
    title: "Performance Optimization: Core Web Vitals and Beyond",
    excerpt: "Deep dive into Core Web Vitals and advanced performance optimization techniques for modern websites.",
    author: "Performance Team",
    date: "2024-01-10",
    category: "Performance",
    tags: ["Performance", "Core Web Vitals", "Optimization"],
  },
  {
    id: 4,
    title: "Green Hosting Providers: Making the Right Choice",
    excerpt: "Compare green hosting providers and learn how to choose environmentally responsible web hosting.",
    author: "Sustainability Team",
    date: "2024-01-08",
    category: "Hosting",
    tags: ["Green Hosting", "Environment", "Providers"],
  },
  {
    id: 5,
    title: "AI-Powered Content Generation for Website Analysis",
    excerpt: "Explore how AI can help generate insights and content based on website analysis data.",
    author: "AI Team",
    date: "2024-01-05",
    category: "AI & Technology",
    tags: ["AI", "Content Generation", "Analysis"],
  },
  {
    id: 6,
    title: "Website Analysis Best Practices: What to Look For",
    excerpt: "Essential metrics and indicators to focus on when analyzing website performance and user experience.",
    author: "Analysis Team",
    date: "2024-01-03",
    category: "Analysis",
    tags: ["Analysis", "Metrics", "Best Practices"],
  },
]

export async function GET() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://wsfynder.vercel.app"

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WSfynder Blog</title>
    <description>Insights, tutorials, and updates about website analysis, sustainability, and performance optimization.</description>
    <link>${baseUrl}/blog</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
    
    ${blogPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${baseUrl}/blog/${post.id}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.id}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>noreply@wsfynder.com (${post.author})</author>
      <category>${post.category}</category>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join("")}
    </item>`,
      )
      .join("")}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}

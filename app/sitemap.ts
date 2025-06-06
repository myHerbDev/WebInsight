import type { MetadataRoute } from "next"
// You might need to fetch provider IDs if you want to include individual hosting detail pages
// import { db } from '@/lib/db'; // Assuming you have a db utility

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.yourwebsite.com" // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date().toISOString()

  // Define static pages
  const staticRoutes = [
    "/",
    "/about",
    "/compare",
    "/complaints",
    "/contact",
    "/hosting",
    "/legal",
    "/privacy",
    "/recommendations",
    "/terms",
    // Add other static pages here
  ]

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: lastModified,
    changeFrequency: route === "/" ? "daily" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }))

  // Add the specific filtered "Green Hosting" view
  sitemapEntries.push({
    url: `${BASE_URL}/hosting?view=green`,
    lastModified: lastModified,
    changeFrequency: "weekly", // Content might update as new green providers are added/ranked
    priority: 0.9, // High priority as it's a key filtered view
  })

  // Example: Add dynamic routes for individual hosting provider detail pages
  // This assumes you have a way to fetch all provider IDs or slugs
  // For demonstration, let's assume you have an API route or DB call
  try {
    const providersResponse = await fetch(`${BASE_URL}/api/hosting-providers`) // Adjust if your API is internal
    if (providersResponse.ok) {
      const providers: { id: number }[] = await providersResponse.json()
      providers.forEach((provider) => {
        sitemapEntries.push({
          url: `${BASE_URL}/hosting/${provider.id}`,
          lastModified: lastModified, // Or fetch lastModified date for each provider if available
          changeFrequency: "monthly",
          priority: 0.7,
        })
      })
    }
  } catch (error) {
    console.error("Failed to fetch providers for sitemap:", error)
    // Decide if you want to fail sitemap generation or continue without dynamic routes
  }

  // Example: Add dynamic routes for other pages if necessary
  // const blogPosts = await fetchBlogPosts(); // Fetch blog post slugs
  // blogPosts.forEach(post => {
  //   sitemapEntries.push({
  //     url: `${BASE_URL}/blog/${post.slug}`,
  //     lastModified: post.updatedAt, // Use actual last modified date
  //     changeFrequency: 'weekly',
  //     priority: 0.6,
  //   });
  // });

  return sitemapEntries
}

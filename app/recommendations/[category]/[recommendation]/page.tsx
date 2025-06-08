import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, Target, Code, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"

// This would typically come from a database or CMS
const recommendationGuides = {
  performance: {
    "image-optimization": {
      title: "Image Optimization Guide",
      description: "Learn how to compress and optimize images for faster loading times",
      difficulty: "Easy",
      impact: "High",
      timeToImplement: "1-2 hours",
      overview:
        "Image optimization is one of the most effective ways to improve website performance. Large, unoptimized images are often the biggest contributor to slow loading times.",
      benefits: [
        "Faster page loading times",
        "Improved user experience",
        "Better SEO rankings",
        "Reduced bandwidth usage",
        "Lower hosting costs",
      ],
      steps: [
        {
          title: "Audit Current Images",
          description: "Identify all images on your website and their current file sizes",
          details: "Use tools like Google PageSpeed Insights or GTmetrix to identify which images need optimization.",
        },
        {
          title: "Choose the Right Format",
          description: "Select appropriate image formats (WebP, JPEG, PNG)",
          details:
            "WebP offers the best compression for most use cases. Use JPEG for photos and PNG for graphics with transparency.",
        },
        {
          title: "Compress Images",
          description: "Reduce file sizes without losing quality",
          details: "Use tools like TinyPNG, ImageOptim, or online compressors to reduce file sizes by 50-80%.",
        },
        {
          title: "Implement Responsive Images",
          description: "Serve different image sizes for different devices",
          details: "Use the srcset attribute to serve appropriately sized images for different screen sizes.",
        },
        {
          title: "Add Lazy Loading",
          description: "Load images only when they're needed",
          details: "Implement lazy loading to defer loading of off-screen images until the user scrolls to them.",
        },
      ],
      tools: [
        { name: "TinyPNG", url: "https://tinypng.com", description: "Online image compression tool" },
        { name: "ImageOptim", url: "https://imageoptim.com", description: "Mac app for image optimization" },
        { name: "Squoosh", url: "https://squoosh.app", description: "Google's image compression tool" },
        {
          name: "WebP Converter",
          url: "https://convertio.co/webp-converter/",
          description: "Convert images to WebP format",
        },
      ],
      codeExample: `<!-- Example of responsive images with lazy loading -->
<img 
  src="image-800w.jpg" 
  srcset="image-400w.jpg 400w, 
          image-800w.jpg 800w, 
          image-1200w.jpg 1200w"
  sizes="(max-width: 400px) 400px, 
         (max-width: 800px) 800px, 
         1200px"
  alt="Descriptive alt text"
  loading="lazy"
  width="800"
  height="600"
>`,
      tips: [
        "Always include width and height attributes to prevent layout shift",
        "Use WebP format with JPEG fallback for maximum compatibility",
        "Optimize images before uploading to your CMS",
        "Consider using a CDN for automatic image optimization",
        "Test your optimizations with real-world connection speeds",
      ],
    },
    "minify-resources": {
      title: "Minify CSS and JavaScript Guide",
      description: "Reduce file sizes by removing unnecessary characters from your code",
      difficulty: "Medium",
      impact: "Medium",
      timeToImplement: "2-4 hours",
      overview:
        "Minification removes unnecessary characters like whitespace, comments, and line breaks from your CSS and JavaScript files, reducing their size and improving load times.",
      benefits: [
        "Smaller file sizes",
        "Faster download times",
        "Reduced bandwidth usage",
        "Improved page load speed",
        "Better user experience",
      ],
      steps: [
        {
          title: "Identify Files to Minify",
          description: "List all CSS and JavaScript files that need minification",
          details: "Focus on your main stylesheet and JavaScript files, especially those loaded in the head section.",
        },
        {
          title: "Choose Minification Tools",
          description: "Select appropriate tools for your development workflow",
          details: "Options include build tools like Webpack, Gulp, or online minifiers for quick fixes.",
        },
        {
          title: "Set Up Build Process",
          description: "Integrate minification into your development workflow",
          details: "Configure your build tools to automatically minify files during the build process.",
        },
        {
          title: "Test Minified Files",
          description: "Ensure functionality remains intact after minification",
          details: "Thoroughly test your website to ensure no functionality is broken by the minification process.",
        },
        {
          title: "Implement in Production",
          description: "Deploy minified files to your live website",
          details: "Replace original files with minified versions and update any references.",
        },
      ],
      tools: [
        { name: "UglifyJS", url: "https://github.com/mishoo/UglifyJS", description: "JavaScript minifier" },
        { name: "CSSNano", url: "https://cssnano.co", description: "CSS minifier" },
        { name: "Terser", url: "https://terser.org", description: "Modern JavaScript minifier" },
        { name: "Online Minifier", url: "https://www.minifier.org", description: "Quick online minification tool" },
      ],
      codeExample: `// Before minification
function calculateTotal(price, tax) {
    // Calculate the total with tax
    const taxAmount = price * tax;
    const total = price + taxAmount;
    return total;
}

// After minification
function calculateTotal(e,t){const a=e*t;return e+a}`,
      tips: [
        "Always keep original files as backups",
        "Use source maps for debugging minified code",
        "Automate minification in your build process",
        "Consider using a CDN that provides automatic minification",
        "Test thoroughly after implementing minification",
      ],
    },
    // Add more performance recommendations here
  },
  seo: {
    "meta-optimization": {
      title: "Meta Tags Optimization Guide",
      description: "Optimize title tags, meta descriptions, and headers for better SEO",
      difficulty: "Easy",
      impact: "High",
      timeToImplement: "2-3 hours",
      overview:
        "Meta tags are crucial for SEO as they help search engines understand your content and influence how your pages appear in search results.",
      benefits: [
        "Better search engine rankings",
        "Higher click-through rates",
        "Improved user experience",
        "Better social media sharing",
        "Enhanced brand visibility",
      ],
      steps: [
        {
          title: "Audit Current Meta Tags",
          description: "Review existing title tags and meta descriptions",
          details: "Use tools like Screaming Frog or Google Search Console to audit your current meta tags.",
        },
        {
          title: "Research Keywords",
          description: "Identify target keywords for each page",
          details: "Use keyword research tools to find relevant, high-volume keywords for your content.",
        },
        {
          title: "Write Compelling Titles",
          description: "Create unique, descriptive title tags for each page",
          details: "Keep titles under 60 characters and include your primary keyword near the beginning.",
        },
        {
          title: "Craft Meta Descriptions",
          description: "Write engaging meta descriptions that encourage clicks",
          details: "Keep descriptions under 160 characters and include a clear call-to-action.",
        },
        {
          title: "Optimize Header Tags",
          description: "Structure content with proper H1, H2, H3 tags",
          details: "Use only one H1 per page and create a logical hierarchy with H2 and H3 tags.",
        },
      ],
      tools: [
        {
          name: "Google Search Console",
          url: "https://search.google.com/search-console",
          description: "Monitor search performance",
        },
        { name: "Yoast SEO", url: "https://yoast.com", description: "WordPress SEO plugin" },
        { name: "SEMrush", url: "https://semrush.com", description: "Comprehensive SEO tool" },
        { name: "Ahrefs", url: "https://ahrefs.com", description: "SEO and keyword research tool" },
      ],
      codeExample: `<!-- Example of optimized meta tags -->
<head>
  <title>Best Coffee Beans | Premium Organic Coffee - CoffeeShop</title>
  <meta name="description" content="Discover our premium organic coffee beans sourced from sustainable farms. Free shipping on orders over $50. Order your perfect cup today!">
  <meta name="keywords" content="organic coffee, premium coffee beans, sustainable coffee, fair trade">
  
  <!-- Open Graph tags for social media -->
  <meta property="og:title" content="Best Coffee Beans | Premium Organic Coffee">
  <meta property="og:description" content="Discover our premium organic coffee beans sourced from sustainable farms.">
  <meta property="og:image" content="https://example.com/coffee-beans.jpg">
  <meta property="og:url" content="https://example.com/coffee-beans">
  
  <!-- Twitter Card tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Best Coffee Beans | Premium Organic Coffee">
  <meta name="twitter:description" content="Discover our premium organic coffee beans sourced from sustainable farms.">
</head>

<body>
  <h1>Premium Organic Coffee Beans</h1>
  <h2>Sustainably Sourced Coffee</h2>
  <h3>Our Coffee Selection</h3>
</body>`,
      tips: [
        "Make each title tag unique across your website",
        "Include your brand name in title tags",
        "Write meta descriptions that match user intent",
        "Use action words in meta descriptions",
        "Test different variations to improve click-through rates",
      ],
    },
    // Add more SEO recommendations here
  },
  // Add other categories (security, accessibility, mobile, sustainability)
}

interface PageProps {
  params: {
    category: string
    recommendation: string
  }
}

export default function RecommendationDetailPage({ params }: PageProps) {
  const guide = recommendationGuides[params.category as keyof typeof recommendationGuides]?.[params.recommendation]

  if (!guide) {
    notFound()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "High":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "Medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/recommendations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recommendations
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{guide.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <Badge className={getDifficultyColor(guide.difficulty)}>{guide.difficulty}</Badge>
            <div className="flex items-center gap-2">
              {getImpactIcon(guide.impact)}
              <span className="text-sm font-medium">{guide.impact} Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{guide.timeToImplement}</span>
            </div>
          </div>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{guide.overview}</p>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {guide.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Implementation Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Implementation Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {guide.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{step.title}</h4>
                    <p className="text-muted-foreground mb-2">{step.description}</p>
                    <p className="text-sm text-muted-foreground">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        {guide.codeExample && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Code Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{guide.codeExample}</code>
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Tools and Resources */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recommended Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.tools.map((tool, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{tool.name}</h4>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pro Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {guide.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-purple-50 to-green-50 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Implement?</h3>
            <p className="text-muted-foreground mb-6">
              Start implementing these recommendations and monitor your website's improvement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">Analyze Your Website</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/recommendations">View More Recommendations</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

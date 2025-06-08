import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, XCircle, Star } from "lucide-react"
import Link from "next/link"

const pricingPlans = [
  {
    name: "Basic Explorer",
    price: "Free",
    frequency: "",
    description: "Perfect for occasional users and quick analyses.",
    features: [
      { text: "5 Website Analyses per Month", included: true },
      { text: "Basic SEO & Performance Metrics", included: true },
      { text: "Limited Content Generation (AI)", included: true },
      { text: "Standard Support", included: true },
      { text: "Advanced Security Analysis", included: false },
      { text: "In-depth Technology Stack", included: false },
      { text: "Hosting Provider Feedback", included: false },
      { text: "API Access", included: false },
    ],
    cta: "Get Started",
    href: "/signup",
    isPopular: false,
  },
  {
    name: "Pro Analyst",
    price: "$29",
    frequency: "/ month",
    description: "For professionals and frequent users needing deeper insights.",
    features: [
      { text: "100 Website Analyses per Month", included: true },
      { text: "Full SEO & Performance Audits", included: true },
      { text: "Extensive Content Generation (AI)", included: true },
      { text: "Priority Support", included: true },
      { text: "Advanced Security Analysis", included: true },
      { text: "In-depth Technology Stack", included: true },
      { text: "Hosting Provider Feedback", included: true },
      { text: "API Access (Beta)", included: true },
    ],
    cta: "Choose Pro",
    href: "/signup?plan=pro",
    isPopular: true,
  },
  {
    name: "Enterprise Suite",
    price: "Custom",
    frequency: "",
    description: "Tailored solutions for businesses and agencies with high-volume needs.",
    features: [
      { text: "Unlimited Website Analyses", included: true },
      { text: "All Pro Features Included", included: true },
      { text: "Custom Content Generation Models", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "White-label Reporting Options", included: true },
      { text: "Volume API Access & SLAs", included: true },
      { text: "Custom Integrations", included: true },
      { text: "Onboarding & Training", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact?subject=EnterpriseInquiry",
    isPopular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Pricing Plans
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the WScrapierr plan that best fits your needs. Unlock powerful web analysis and content generation
          tools today.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col ${plan.isPopular ? "border-primary shadow-xl ring-2 ring-primary" : "hover:shadow-lg transition-shadow"}`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full shadow-md flex items-center">
                <Star className="h-4 w-4 mr-1" /> Popular
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
              <div className="text-4xl font-bold mt-2">
                {plan.price}
                {plan.frequency && <span className="text-lg font-normal text-muted-foreground">{plan.frequency}</span>}
              </div>
              <CardDescription className="mt-1 h-12">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    )}
                    <span className={!feature.included ? "text-muted-foreground line-through" : ""}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className={`w-full ${plan.isPopular ? "" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-16 md:mt-24 text-center bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto text-left space-y-4">
          <div>
            <h3 className="font-medium">Can I change my plan later?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time from your account settings.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Is there a free trial for paid plans?</h3>
            <p className="text-sm text-muted-foreground">
              We offer a free Basic Explorer plan to get you started. For Pro features, you can subscribe directly. We
              occasionally run promotions, so keep an eye out!
            </p>
          </div>
          <div>
            <h3 className="font-medium">What payment methods do you accept?</h3>
            <p className="text-sm text-muted-foreground">
              We accept all major credit cards. For Enterprise plans, we also support invoicing.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

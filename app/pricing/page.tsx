import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Check, X, Zap, Crown, Building, Star } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing Plans | WSfynder Website Analysis Platform",
  description:
    "Choose the perfect WSfynder plan for your needs. From free analysis to enterprise solutions with advanced features and priority support.",
}

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: { monthly: 0, yearly: 0 },
    icon: Zap,
    color: "from-gray-500 to-gray-600",
    features: [
      { name: "5 website analyses per month", included: true },
      { name: "Basic performance metrics", included: true },
      { name: "SEO analysis", included: true },
      { name: "Security scan", included: true },
      { name: "PDF export", included: true },
      { name: "Community support", included: true },
      { name: "API access", included: false },
      { name: "Custom reports", included: false },
      { name: "Priority support", included: false },
      { name: "Team collaboration", included: false },
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    description: "For professionals and small teams",
    price: { monthly: 29, yearly: 290 },
    icon: Star,
    color: "from-purple-500 to-purple-600",
    features: [
      { name: "100 website analyses per month", included: true },
      { name: "Advanced performance metrics", included: true },
      { name: "Comprehensive SEO analysis", included: true },
      { name: "Security & accessibility scans", included: true },
      { name: "PDF & CSV export", included: true },
      { name: "Email support", included: true },
      { name: "API access (1000 calls/month)", included: true },
      { name: "Custom branded reports", included: true },
      { name: "Historical data (6 months)", included: true },
      { name: "Team collaboration (5 members)", included: true },
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Business",
    description: "For growing businesses and agencies",
    price: { monthly: 99, yearly: 990 },
    icon: Building,
    color: "from-green-500 to-green-600",
    features: [
      { name: "500 website analyses per month", included: true },
      { name: "All Pro features", included: true },
      { name: "White-label reports", included: true },
      { name: "API access (10,000 calls/month)", included: true },
      { name: "Priority support", included: true },
      { name: "Historical data (2 years)", included: true },
      { name: "Team collaboration (25 members)", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "SLA guarantee", included: true },
    ],
    cta: "Start Business Trial",
    popular: false,
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: { monthly: "Custom", yearly: "Custom" },
    icon: Crown,
    color: "from-orange-500 to-orange-600",
    features: [
      { name: "Unlimited website analyses", included: true },
      { name: "All Business features", included: true },
      { name: "Custom API limits", included: true },
      { name: "24/7 phone support", included: true },
      { name: "Unlimited historical data", included: true },
      { name: "Unlimited team members", included: true },
      { name: "Custom development", included: true },
      { name: "On-premise deployment", included: true },
      { name: "Training & onboarding", included: true },
      { name: "Custom SLA", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

const addOns = [
  {
    name: "Additional API Calls",
    description: "Extra API calls beyond your plan limit",
    price: "$0.01 per call",
  },
  {
    name: "Extended Data Retention",
    description: "Keep historical data for up to 5 years",
    price: "$50/month",
  },
  {
    name: "Custom Integrations",
    description: "Build custom integrations for your workflow",
    price: "Starting at $2,500",
  },
  {
    name: "Training & Onboarding",
    description: "Dedicated training sessions for your team",
    price: "$500 per session",
  },
]

const faqs = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "If you exceed your monthly analysis limit, you can purchase additional analyses or upgrade to a higher plan. We'll notify you before you reach your limit.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for enterprise customers. All payments are processed securely.",
  },
  {
    question: "Can I get a custom plan?",
    answer:
      "For enterprise customers, we can create custom plans tailored to your specific needs. Contact our sales team to discuss your requirements.",
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your website optimization needs. Start free and scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className="text-sm font-medium">
              Monthly
            </Label>
            <Switch id="billing-toggle" />
            <Label htmlFor="billing-toggle" className="text-sm font-medium">
              Yearly
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            </Label>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? "ring-2 ring-primary shadow-lg scale-105" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}
                >
                  <plan.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-3xl font-bold">
                    {typeof plan.price.monthly === "number" ? (
                      <>
                        ${plan.price.monthly}
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </>
                    ) : (
                      plan.price.monthly
                    )}
                  </div>
                  {typeof plan.price.yearly === "number" && plan.price.yearly > 0 && (
                    <div className="text-sm text-muted-foreground">or ${plan.price.yearly}/year</div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  className={`w-full mb-6 ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>{plan.cta}</Link>
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Add-ons & Extras</CardTitle>
            <CardDescription>Enhance your plan with additional features and services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addOns.map((addon, index) => (
                <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{addon.name}</h4>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{addon.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Features */}
        <Card className="mb-16 bg-gradient-to-r from-purple-50 to-green-50 border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Enterprise Features</h3>
              <p className="text-muted-foreground">
                Advanced capabilities for large organizations and high-volume users
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Dedicated Infrastructure</h4>
                <p className="text-sm text-muted-foreground">
                  Dedicated servers and resources for maximum performance and reliability.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">On-Premise Deployment</h4>
                <p className="text-sm text-muted-foreground">
                  Deploy WSfynder within your own infrastructure for maximum security and control.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Custom Development</h4>
                <p className="text-sm text-muted-foreground">
                  Custom features and integrations built specifically for your organization.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link href="/contact">Contact Enterprise Sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions about our pricing and plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-2">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Still have questions? We're here to help.</p>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

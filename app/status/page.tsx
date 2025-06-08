import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Info, Server } from "lucide-react"

// This would typically be fetched from a status API
const servicesStatus = [
  {
    name: "Website Analysis Engine",
    status: "operational",
    description: "Core service for scraping and analyzing website data.",
    lastIncident: null,
  },
  {
    name: "AI Content Generation API",
    status: "operational",
    description: "Handles requests to our AI models for content creation.",
    lastIncident: { date: "2025-06-07", message: "Brief latency issues, resolved." },
  },
  {
    name: "User Authentication",
    status: "operational",
    description: "Manages user sign-up, login, and session management.",
    lastIncident: null,
  },
  {
    name: "Database Services",
    status: "operational",
    description: "Storage for user data and analysis results.",
    lastIncident: null,
  },
  {
    name: "Hosting Provider API",
    status: "degraded_performance",
    description: "Service for fetching and updating hosting provider information.",
    lastIncident: { date: "2025-06-08", message: "Experiencing high load, working on scaling." },
  },
  {
    name: "Public Website & Docs",
    status: "operational",
    description: "WScrapierr.com and documentation site.",
    lastIncident: null,
  },
]

const statusMap = {
  operational: {
    icon: CheckCircle,
    color: "text-green-500",
    badgeVariant: "default",
    label: "Operational",
    badgeClass: "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
  },
  degraded_performance: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    badgeVariant: "secondary",
    label: "Degraded Performance",
    badgeClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100",
  },
  partial_outage: {
    icon: AlertTriangle,
    color: "text-orange-500",
    badgeVariant: "destructive",
    label: "Partial Outage",
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100",
  },
  major_outage: {
    icon: AlertTriangle,
    color: "text-red-500",
    badgeVariant: "destructive",
    label: "Major Outage",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100",
  },
  maintenance: {
    icon: Info,
    color: "text-blue-500",
    badgeVariant: "outline",
    label: "Maintenance",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100",
  },
}

export default function StatusPage() {
  const overallStatus = servicesStatus.every((s) => s.status === "operational")
    ? "operational"
    : servicesStatus.some((s) => s.status === "major_outage" || s.status === "partial_outage")
      ? "major_outage"
      : "degraded_performance"

  const OverallStatusIcon = statusMap[overallStatus].icon
  const overallStatusColor = statusMap[overallStatus].color
  const overallStatusLabel = statusMap[overallStatus].label

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            System Status
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Current operational status of WScrapierr services. We believe in transparency.
        </p>
      </header>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className={`flex items-center text-2xl ${overallStatusColor}`}>
            <OverallStatusIcon className="h-7 w-7 mr-3" />
            Overall System Status: {overallStatusLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {overallStatus === "operational"
              ? "All systems are currently operational."
              : "Some systems may be experiencing issues. See details below."}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {servicesStatus.map((service) => {
          const Icon = statusMap[service.status].icon
          const color = statusMap[service.status].color
          const badgeClass = statusMap[service.status].badgeClass
          const label = statusMap[service.status].label

          return (
            <Card key={service.name} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50 p-4">
                <div className="flex items-center">
                  <Server className="h-5 w-5 mr-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium">{service.name}</h3>
                </div>
                <Badge className={`${badgeClass} font-semibold`}>{label}</Badge>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                {service.lastIncident && (
                  <div className="text-xs bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-md border border-yellow-200 dark:border-yellow-700">
                    <span className="font-semibold">Last Incident ({service.lastIncident.date}):</span>{" "}
                    {service.lastIncident.message}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <section className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}. For real-time updates, please subscribe to our status page
          (feature coming soon).
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          If you are experiencing issues not reflected here, please{" "}
          <Link href="/support" className="text-primary hover:underline">
            contact support
          </Link>
          .
        </p>
      </section>
    </div>
  )
}

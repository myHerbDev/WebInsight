import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Server, Database, Globe } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "System Status | WSfynder Service Health",
  description:
    "Check the current status of WSfynder services including API, analysis engine, and website availability.",
}

const systemStatus = {
  overall: "operational", // operational, degraded, outage
  lastUpdated: "2024-01-15T10:30:00Z",
  uptime: "99.98%",
}

const services = [
  {
    name: "Website Analysis API",
    status: "operational",
    uptime: "99.99%",
    responseTime: "245ms",
    description: "Core website analysis functionality",
    icon: Activity,
  },
  {
    name: "AI Content Generation",
    status: "operational",
    uptime: "99.95%",
    responseTime: "1.2s",
    description: "AI-powered content generation service",
    icon: Server,
  },
  {
    name: "Database Services",
    status: "operational",
    uptime: "99.98%",
    responseTime: "12ms",
    description: "Data storage and retrieval systems",
    icon: Database,
  },
  {
    name: "CDN & Static Assets",
    status: "operational",
    uptime: "99.99%",
    responseTime: "89ms",
    description: "Content delivery network and static files",
    icon: Globe,
  },
  {
    name: "Authentication Service",
    status: "operational",
    uptime: "99.97%",
    responseTime: "156ms",
    description: "User authentication and authorization",
    icon: CheckCircle,
  },
  {
    name: "Export Services",
    status: "operational",
    uptime: "99.94%",
    responseTime: "2.1s",
    description: "PDF and data export functionality",
    icon: CheckCircle,
  },
]

const incidents = [
  {
    id: "INC-2024-001",
    title: "Temporary API Slowdown",
    status: "resolved",
    severity: "minor",
    startTime: "2024-01-14T15:30:00Z",
    endTime: "2024-01-14T16:45:00Z",
    description:
      "Some users experienced slower response times for website analysis. Issue was resolved by scaling up server capacity.",
    affectedServices: ["Website Analysis API"],
  },
  {
    id: "INC-2024-002",
    title: "Scheduled Maintenance",
    status: "resolved",
    severity: "maintenance",
    startTime: "2024-01-10T02:00:00Z",
    endTime: "2024-01-10T04:00:00Z",
    description: "Scheduled database maintenance to improve performance. All services were temporarily unavailable.",
    affectedServices: ["All Services"],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "operational":
      return "text-green-600 bg-green-100"
    case "degraded":
      return "text-yellow-600 bg-yellow-100"
    case "outage":
      return "text-red-600 bg-red-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "operational":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "degraded":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "outage":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800"
    case "major":
      return "bg-orange-100 text-orange-800"
    case "minor":
      return "bg-yellow-100 text-yellow-800"
    case "maintenance":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

export default function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              System Status
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">Real-time status of WSfynder services and infrastructure</p>
        </div>

        {/* Overall Status */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(systemStatus.overall)}
                  Overall System Status
                </CardTitle>
                <CardDescription>Last updated: {formatDate(systemStatus.lastUpdated)}</CardDescription>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(systemStatus.overall)}>
                  {systemStatus.overall.charAt(0).toUpperCase() + systemStatus.overall.slice(1)}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">{systemStatus.uptime} uptime</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Services Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Current status of all WSfynder services and components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <service.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(service.status)}
                      <Badge className={getStatusColor(service.status)}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span>{service.uptime} uptime</span>
                      <span className="mx-2">•</span>
                      <span>{service.responseTime} avg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
            <CardDescription>Past incidents and maintenance windows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{incident.title}</h4>
                        <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                      <div className="text-xs text-muted-foreground">
                        <span>Started: {formatDate(incident.startTime)}</span>
                        {incident.endTime && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Resolved: {formatDate(incident.endTime)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>Affected services: {incident.affectedServices.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscribe to Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Stay Updated</CardTitle>
            <CardDescription>Get notified about service updates and maintenance windows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  Subscribe to our status page to receive notifications about incidents, maintenance, and service
                  updates.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Alternative ways to stay updated:</p>
                <ul className="space-y-1">
                  <li>• Follow us on Twitter @WSfynder</li>
                  <li>• Join our Discord community</li>
                  <li>• RSS feed available</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

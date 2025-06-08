import type React from "react"
import type { WebsiteData } from "@/types/website-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Server,
  ShieldCheck,
  Zap,
  Leaf,
  BarChart3,
  Users,
  LinkIcon,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { format, parseISO } from "date-fns"

interface SearchResultsDisplayProps {
  results: WebsiteData | null
  isLoading: boolean
  error: string | null
}

const IconMap = {
  Globe: <Globe className="h-5 w-5 text-blue-500" />,
  Server: <Server className="h-5 w-5 text-green-500" />,
  ShieldCheck: <ShieldCheck className="h-5 w-5 text-red-500" />,
  Zap: <Zap className="h-5 w-5 text-yellow-500" />,
  Leaf: <Leaf className="h-5 w-5 text-emerald-500" />,
  BarChart3: <BarChart3 className="h-5 w-5 text-purple-500" />,
  Users: <Users className="h-5 w-5 text-teal-500" />,
  LinkIcon: <LinkIcon className="h-5 w-5 text-indigo-500" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5 text-orange-500" />,
  CheckCircle: <CheckCircle className="h-5 w-5 text-green-600" />,
  Info: <Info className="h-5 w-5 text-sky-500" />,
}

const ResultItem: React.FC<{
  title: string
  value: string | number | undefined | null
  icon?: keyof typeof IconMap
  unit?: string
  isPill?: boolean
  date?: boolean
}> = ({ title, value, icon, unit, isPill, date }) => {
  if (value === undefined || value === null || value === "") return null

  const displayValue = date && typeof value === "string" ? format(parseISO(value), "PPP p") : value

  return (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
        {icon && IconMap[icon] && <span className="mr-2">{IconMap[icon]}</span>}
        {title}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
        {isPill ? (
          <Badge variant="secondary" className="text-sm">
            {displayValue} {unit}
          </Badge>
        ) : (
          <span className="text-sm">
            {displayValue} {unit}
          </span>
        )}
      </dd>
    </div>
  )
}

export const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({ results, isLoading, error }) => {
  if (isLoading) {
    // This will be handled by app/loading.tsx for the initial load.
    // For subsequent loads within the page, you might add a spinner here.
    return null
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 border-red-500 bg-red-50 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-400 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Analysis Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Please check the URL and try again. If the issue persists, the website might be inaccessible or blocking
            automated analysis.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!results) {
    return null // No results to display yet, or initial state
  }

  const {
    metadata,
    hosting,
    performance,
    security,
    sustainability,
    technologies,
    traffic,
    domain,
    links,
    analysisDate,
  } = results

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-6">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {metadata?.favicon ? (
              <img src={metadata.favicon || "/placeholder.svg"} alt="Favicon" className="h-10 w-10 rounded-sm" />
            ) : (
              <Globe className="h-10 w-10 text-blue-500" />
            )}
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
                {metadata?.title || "Website Analysis"}
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400 hover:underline">
                <a href={results.url} target="_blank" rel="noopener noreferrer">
                  {results.url}
                </a>
              </CardDescription>
            </div>
          </div>
          {analysisDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
              Analyzed on: {format(parseISO(analysisDate), "PPP p")}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {metadata?.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{metadata.description}</p>
          )}
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <ResultItem title="Keywords" value={metadata?.keywords?.join(", ")} icon="Info" isPill />
          </dl>
        </CardContent>
      </Card>

      {hosting && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Server className="mr-2 h-6 w-6 text-green-500" />
              Hosting Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <ResultItem title="Provider" value={hosting.provider} />
              <ResultItem title="IP Address" value={hosting.ipAddress} />
              <ResultItem title="Location" value={hosting.location} />
              <ResultItem title="Server Type" value={hosting.serverType} />
            </dl>
          </CardContent>
        </Card>
      )}

      {performance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Zap className="mr-2 h-6 w-6 text-yellow-500" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <ResultItem title="Load Time" value={performance.loadTime} unit="ms" />
              <ResultItem title="Page Size" value={performance.pageSize} unit="KB" />
              <ResultItem title="TTFB" value={performance.ttfb} unit="ms" />
              <ResultItem title="FCP" value={performance.fcp} unit="ms" />
              <ResultItem title="LCP" value={performance.lcp} unit="ms" />
              <ResultItem title="CLS" value={performance.cls} />
            </dl>
          </CardContent>
        </Card>
      )}

      {security && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <ShieldCheck className="mr-2 h-6 w-6 text-red-500" />
              Security Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <ResultItem
                title="HTTPS Enabled"
                value={security.httpsEnabled ? "Yes" : "No"}
                icon={security.httpsEnabled ? "CheckCircle" : "AlertTriangle"}
              />
              <ResultItem title="SSL Issuer" value={security.sslIssuer} />
              <ResultItem title="SSL Expiry" value={security.sslExpiryDate} date />
              <ResultItem title="HTTP Headers" value={security.httpHeaders?.join(", ")} isPill />
              <ResultItem
                title="Security Issues"
                value={security.vulnerabilitiesFound ? security.vulnerabilities?.join(", ") : "None Found"}
                icon={security.vulnerabilitiesFound ? "AlertTriangle" : "CheckCircle"}
                isPill={security.vulnerabilitiesFound}
              />
            </dl>
          </CardContent>
        </Card>
      )}

      {sustainability && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Leaf className="mr-2 h-6 w-6 text-emerald-500" />
              Sustainability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <ResultItem
                title="Green Hosting"
                value={sustainability.isGreenHosting ? "Yes" : "Likely Not / Unknown"}
                icon={sustainability.isGreenHosting ? "CheckCircle" : "Info"}
              />
              <ResultItem title="Carbon Emissions" value={sustainability.carbonEmissions} unit="g CO2e/view" />
              <ResultItem title="Energy Source" value={sustainability.energySource} />
            </dl>
          </CardContent>
        </Card>
      )}

      {technologies && technologies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <BarChart3 className="mr-2 h-6 w-6 text-purple-500" />
              Technologies Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {traffic && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="mr-2 h-6 w-6 text-teal-500" />
              Traffic Estimates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <ResultItem title="Global Rank" value={traffic.globalRank} />
              <ResultItem title="Country Rank" value={traffic.countryRank} />
              <ResultItem title="Monthly Visits" value={traffic.monthlyVisits} />
              <ResultItem title="Bounce Rate" value={traffic.bounceRate} unit="%" />
            </dl>
          </CardContent>
        </Card>
      )}

      {domain && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Globe className="mr-2 h-6 w-6 text-blue-500" />
              Domain Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <ResultItem title="Registrar" value={domain.registrar} />
              <ResultItem title="Registration Date" value={domain.registrationDate} date />
              <ResultItem title="Expiry Date" value={domain.expiryDate} date />
              <ResultItem title="Nameservers" value={domain.nameservers?.join(", ")} isPill />
            </dl>
          </CardContent>
        </Card>
      )}

      {links && (links.internalLinks > 0 || links.externalLinks > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <LinkIcon className="mr-2 h-6 w-6 text-indigo-500" />
              Link Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <ResultItem title="Internal Links" value={links.internalLinks} />
              <ResultItem title="External Links" value={links.externalLinks} />
              <ResultItem
                title="Broken Links"
                value={links.brokenLinks}
                icon={links.brokenLinks > 0 ? "AlertTriangle" : "CheckCircle"}
              />
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

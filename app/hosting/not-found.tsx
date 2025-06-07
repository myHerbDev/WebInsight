// This will be used if notFound() is called in app/hosting/page.tsx
// For app/hosting/[id]/not-found.tsx, it's implicitly handled by Next.js if the dynamic segment page calls notFound()
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function HostingProvidersNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Hosting Providers Not Found</h1>
      <p className="text-muted-foreground mb-8">
        We couldn't find the list of hosting providers. This might be a temporary issue.
      </p>
      <Button asChild>
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  )
}

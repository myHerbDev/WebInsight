import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ServerCrash } from "lucide-react"

export default function HostingProviderNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center flex flex-col items-center justify-center min-h-[calc(100vh-20rem)]">
      <ServerCrash className="mx-auto h-16 w-16 text-destructive mb-6" />
      <h1 className="text-4xl font-bold mb-4">Provider Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Oops! We couldn't find the hosting provider you're looking for. It might have been moved, deleted, or the ID is
        incorrect.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/hosting">View All Providers</Link>
        </Button>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  )
}

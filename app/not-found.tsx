import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

function NotFoundContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="space-y-4">
          <Button asChild size="lg">
            <Link href="/">Return Home</Link>
          </Button>

          <div className="text-sm text-gray-500">
            <Link href="/docs" className="hover:text-gray-700 underline">
              Documentation
            </Link>
            {" • "}
            <Link href="/support" className="hover:text-gray-700 underline">
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  )
}

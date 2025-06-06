import { Skeleton } from "@/components/ui/skeleton"
import { Logo } from "@/components/logo"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Logo size="md" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="mb-8">
        <Skeleton className="h-10 w-64 mx-auto mb-2" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className="rounded-full w-10 h-10 bg-blue-600"></div>
          <Skeleton className="h-1 w-16" />
          <Skeleton className="rounded-full w-10 h-10" />
          <Skeleton className="h-1 w-16" />
          <Skeleton className="rounded-full w-10 h-10" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

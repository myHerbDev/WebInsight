import { Skeleton } from "@/components/ui/skeleton"

export default function HostingProviderDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <Skeleton className="h-10 w-48 mb-6" /> {/* Back button placeholder */}
      {/* Header Card Skeleton */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <Skeleton className="h-9 w-3/5 mb-2" /> {/* Title */}
            <Skeleton className="h-6 w-4/5" /> {/* Description */}
          </div>
          <Skeleton className="h-12 w-36 mt-2 sm:mt-0" /> {/* Visit Website Button */}
        </div>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-2/3 mb-1" /> {/* Label */}
              <Skeleton className="h-6 w-1/2" /> {/* Value */}
              <Skeleton className="h-2 w-full" /> {/* Progress bar */}
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-px w-full my-10" /> {/* Separator */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-8 w-1/3 mb-4" /> {/* Reviews Title */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-6 border rounded-lg bg-card flex space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" /> {/* User Name */}
                <Skeleton className="h-4 w-1/3" /> {/* Rating Stars */}
                <Skeleton className="h-4 w-full" /> {/* Comment line 1 */}
                <Skeleton className="h-4 w-3/4" /> {/* Comment line 2 */}
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 border rounded-lg bg-card space-y-6">
          <Skeleton className="h-7 w-1/2 mb-2" /> {/* Leave Review Title */}
          <Skeleton className="h-10 w-1/2 mb-4" /> {/* Rating Stars Input */}
          <Skeleton className="h-24 w-full mb-4" /> {/* Textarea */}
          <Skeleton className="h-10 w-full sm:w-1/2" /> {/* Submit Button */}
        </div>
      </div>
    </div>
  )
}

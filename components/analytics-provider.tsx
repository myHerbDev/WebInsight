"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views
    if (typeof window !== "undefined") {
      // Add your analytics tracking here
      console.log("Page view:", pathname, searchParams.toString())
    }
  }, [pathname, searchParams])

  return null
}

import type React from "react"
// Client-side error boundary utilities
export function withErrorBoundary<T>(operation: () => T, fallback: T, errorMessage = "Operation failed"): T {
  try {
    return operation()
  } catch (error) {
    console.error(errorMessage, error)
    return fallback
  }
}

export function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage = "Async operation failed",
): Promise<T> {
  return operation().catch((error) => {
    console.error(errorMessage, error)
    return fallback
  })
}

export function createSafeComponent<P extends object>(
  Component: React.ComponentType<P>,
  fallback: React.ComponentType<P> | null = null,
): React.ComponentType<P> {
  return function SafeComponent(props: P) {
    try {
      return <Component {...props} />
    } catch (error) {
      console.error("Component render error:", error)
      if (fallback) {
        return <fallback {...props} />
      }
      return <div>Error loading component</div>
    }
  }
}

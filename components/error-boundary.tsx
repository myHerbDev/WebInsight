"use client" // This component must be a Client Component

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button" // Assuming you have a Button component

interface Props {
  children: ReactNode
  fallback?: ReactNode // Optional custom fallback UI
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo)
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    // Optionally, you could try to re-render the children or navigate to a safe page
    // window.location.reload(); // Simplest reset, but might not be ideal UX
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
          <h1 className="text-3xl font-bold text-destructive mb-4">Oops! Something went wrong.</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            We're sorry for the inconvenience. An unexpected error occurred. Please try refreshing the page or clicking
            the button below.
          </p>
          {this.state.error && (
            <details className="mb-6 p-4 border rounded-md bg-destructive/10 text-left max-w-xl w-full">
              <summary className="cursor-pointer font-medium text-destructive">Error Details</summary>
              <pre className="mt-2 text-xs whitespace-pre-wrap break-all">
                {this.state.error.name}: {this.state.error.message}
                {this.state.error.stack && `\n${this.state.error.stack}`}
              </pre>
            </details>
          )}
          <Button onClick={this.handleReset} size="lg">
            Try Again
          </Button>
          <p className="text-sm text-muted-foreground mt-8">If the problem persists, please contact support.</p>
        </div>
      )
    }

    return this.props.children
  }
}

// Centralized error handling utilities

export interface AppError {
  message: string
  code?: string
  status?: number
  details?: any
}

export class SafeError extends Error {
  public code?: string
  public status?: number
  public details?: any

  constructor(message: string, code?: string, status?: number, details?: any) {
    super(message)
    this.name = "SafeError"
    this.code = code
    this.status = status
    this.details = details
  }
}

// Safe error response utility
export function createErrorResponse(error: any, defaultMessage = "An error occurred"): Response {
  console.error("Creating error response:", error)

  let message = defaultMessage
  let status = 500
  let code = "INTERNAL_ERROR"

  if (error instanceof SafeError) {
    message = error.message
    status = error.status || 500
    code = error.code || "SAFE_ERROR"
  } else if (error instanceof Error) {
    message = error.message || defaultMessage
  } else if (typeof error === "string") {
    message = error
  }

  // Sanitize error message for production
  if (process.env.NODE_ENV === "production") {
    // Don't expose internal error details in production
    if (status === 500) {
      message = "Internal server error"
    }
  }

  return new Response(
    JSON.stringify({
      error: message,
      code,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

// Validate JSON input
export function validateJsonInput(input: any, requiredFields: string[] = []): void {
  if (!input || typeof input !== "object") {
    throw new SafeError("Invalid input: must be a valid object", "INVALID_INPUT", 400)
  }

  for (const field of requiredFields) {
    if (!(field in input) || input[field] === null || input[field] === undefined) {
      throw new SafeError(`Missing required field: ${field}`, "MISSING_FIELD", 400)
    }
  }
}

// Safe async wrapper
export async function safeAsync<T>(operation: () => Promise<T>, errorMessage = "Operation failed"): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(errorMessage, error)
    throw error instanceof SafeError ? error : new SafeError(errorMessage, "OPERATION_FAILED", 500)
  }
}

// This file was already provided in the user's context and seems mostly fine.
// I will use the existing one and ensure it integrates.
// Key changes:
// - Ensure `SafeError` is properly defined.
// - `createErrorResponse` for API routes.
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
    Object.setPrototypeOf(this, SafeError.prototype) // For proper instanceof checks
  }
}

export function createErrorResponse(error: any, defaultMessage = "An error occurred"): Response {
  console.error("API Error:", error)

  let message = defaultMessage
  let status = 500
  let code = "INTERNAL_ERROR"
  let details

  if (error instanceof SafeError) {
    message = error.message
    status = error.status || 500
    code = error.code || "SAFE_ERROR"
    details = error.details
  } else if (error instanceof Error) {
    message = error.message || defaultMessage
    // Try to infer status from error message if common patterns exist
    if (error.message.toLowerCase().includes("not found")) status = 404
    if (error.message.toLowerCase().includes("unauthorized")) status = 401
    if (error.message.toLowerCase().includes("forbidden")) status = 403
    if (error.message.toLowerCase().includes("bad request") || error.message.toLowerCase().includes("invalid input"))
      status = 400
  } else if (typeof error === "string") {
    message = error
  }

  // Sanitize error message for production to avoid leaking sensitive details
  const isProduction = process.env.NODE_ENV === "production"
  const responsePayload: { error: string; code: string; timestamp: string; details?: any } = {
    error: isProduction && status >= 500 ? "An internal server error occurred." : message,
    code,
    timestamp: new Date().toISOString(),
  }

  if (!isProduction && details) {
    responsePayload.details = details
  }

  if (!isProduction && error instanceof Error && error.stack && status >= 500) {
    responsePayload.details = {
      ...(responsePayload.details || {}),
      stack: error.stack.split("\n").slice(0, 5).join("\n"),
    } // Include brief stack in dev
  }

  return new Response(JSON.stringify(responsePayload), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export function validateJsonInput(input: any, requiredFields: string[] = []): void {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    // Ensure it's an object, not an array
    throw new SafeError("Invalid input: must be a valid JSON object.", "INVALID_INPUT_TYPE", 400)
  }

  for (const field of requiredFields) {
    if (
      !(field in input) ||
      input[field] === null ||
      input[field] === undefined ||
      String(input[field]).trim() === ""
    ) {
      throw new SafeError(`Missing or empty required field: ${field}`, "MISSING_FIELD", 400, { field })
    }
  }
}

export async function safeAsync<T>(
  operation: () => Promise<T>,
  errorMessage = "Operation failed",
  errorCode = "OPERATION_FAILED",
  errorStatus = 500,
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    if (error instanceof SafeError) throw error
    throw new SafeError(errorMessage, errorCode, errorStatus, {
      originalError: error instanceof Error ? error.message : String(error),
    })
  }
}

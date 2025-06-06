export class SafeOperationError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message)
    this.name = "SafeOperationError"
  }
}

export async function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage?: string,
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error(errorMessage || "Safe async operation failed:", error)
    return fallback
  }
}

export function safeOperation<T>(operation: () => T, fallback: T, errorMessage?: string): T {
  try {
    return operation()
  } catch (error) {
    console.error(errorMessage || "Safe operation failed:", error)
    return fallback
  }
}

export function validateRequired<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined) {
    throw new SafeOperationError(`Required field '${fieldName}' is missing`)
  }
  return value
}

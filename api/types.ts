export type ApiResponse<T> = {
  data: T
  message?: string
  success?: boolean
  status?: number
}

export type PaginatedApiResponse<T> = {
  success: true,
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    total_pages: number
  }
}

/** Unwraps `{ data, status }` API bodies; passes through if already the inner payload. */
export function unwrapApiData<T>(body: ApiResponse<T> | T): T {
  if (
    body !== null &&
    typeof body === "object" &&
    "data" in body
  ) {
    return (body as { data: T }).data
  }
  return body as T
}

// Error types
export type SimpleError = {
  message: string; // Adjusted to match bimanage-dashboard's use of 'message'
  detail?: string;
}

export type ValidationErrorItem = {
  type: string
  loc: string[]
  msg: string
  input: unknown
  ctx?: Record<string, unknown>
}

export type ValidationError = {
  detail: ValidationErrorItem[]
}

export type ApiError = SimpleError | ValidationError

// Type guard functions
export function isSimpleError(error: unknown): error is SimpleError {
  return error !== null && typeof error === 'object' && ('message' in error || 'detail' in error)
}

export function isValidationError(error: unknown): error is ValidationError {
  return error !== null && typeof error === 'object' && 'detail' in error && Array.isArray((error as ValidationError).detail)
}

export function getErrorMessage(error: any): { title: string; message: string } {
  // Handle Axios error structure
  const data = error?.response?.data || error;

  if (isSimpleError(data)) {
    return {
      title: 'Error',
      message: data.message || data.detail || 'Unknown error'
    }
  }

  if (isValidationError(data)) {
    return {
      title: 'Validation Error',
      message: data.detail.map(item => item.msg).join(', ')
    }
  }

  return { title: 'Error', message: data?.message || error?.message || 'Unknown error occurred' }
}

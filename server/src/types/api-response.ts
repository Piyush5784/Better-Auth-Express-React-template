/**
 * Standard API Response format for all endpoints
 */
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

/**
 * Helper functions to create standardized responses
 */
export const createSuccessResponse = <T = any>(
  data?: T,
  message?: string
): ApiResponse<T> => ({
  success: true,
  message,
  data,
})

export const createErrorResponse = (error: string): ApiResponse => ({
  success: false,
  error,
})

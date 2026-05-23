export interface ErrorResponse {
    success: false
    message: string
    errors: Record<string, string[]>
    statusCode: number
    timestamp: string
    path?: string | null
}
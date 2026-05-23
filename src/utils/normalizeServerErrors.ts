import type { ErrorResponse } from "../types/ErrorResponse";

// export default function normalizeServerErrors(
//     errors: Record<string, string[]>
// ): Record<string, string[]> {
//     const normalized: Record<string, string[]> = {};

//     for (const key in errors) {
//         const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
//         normalized[camelKey] = errors[key];
//     }

//     return normalized;
// }

export default function normalizeError(error: any): ErrorResponse {
    // Axios error with server response
    if (error?.response?.data) {
        return error.response.data as ErrorResponse;
    }

    // Network or unexpected client-side error
    const message = error?.message || "Unexpected client error."

    return {
        success: false,
        message,
        errors: { general: [message] },
        statusCode: 0,
        timestamp: new Date().toISOString(),
        path: null
    }
}
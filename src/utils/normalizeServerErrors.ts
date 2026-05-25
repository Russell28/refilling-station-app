import type { ErrorResponse } from "../types/ErrorResponse";

export function normalizeServerErrors(
    errors: Record<string, string[]>
): Record<string, string[]> {
    const normalized: Record<string, string[]> = {};

    for (const key in errors) {
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
        normalized[camelKey] = errors[key];
    }

    return normalized;
}

export function normalizeError(error: any): ErrorResponse {
    // Axios error with server response
    if (error?.response?.data) {
        const data = error.response.data;
        const errors = normalizeServerErrors(
            data.errors ?? data.Errors ?? { general: [data.message ?? data.Message ?? "Unexpected server error."] }
        );

        return {
            success: data.success ?? data.Success ?? false,
            message: data.message ?? data.Message ?? "Unexpected server error.",
            errors,
            statusCode: data.statusCode ?? data.StatusCode ?? error.response.status ?? 0,
            timestamp: data.timestamp ?? data.Timestamp ?? new Date().toISOString(),
            path: data.path ?? data.Path ?? null,
        };
    }

    // Network or unexpected client-side error
    const message = error?.message || "Unexpected client error.";

    return {
        success: false,
        message,
        errors: { general: [message] },
        statusCode: 0,
        timestamp: new Date().toISOString(),
        path: null,
    };
}
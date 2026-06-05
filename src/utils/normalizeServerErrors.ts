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
  if (error?.response) {
    const data = error.response.data ?? {};
    const errors = normalizeServerErrors(
      data.errors ?? data.Errors ?? { general: [data.message ?? data.Message ?? "Unexpected server error."] }
    );

    return {
      success: data.success ?? data.Success ?? false,
      message: data.message ?? data.Message ?? "Unexpected server error.",
      errors,
      // Always prefer the actual HTTP status code
      statusCode: data.statusCode ?? data.StatusCode ?? error.response.status ?? 0,
      timestamp: data.timestamp ?? data.Timestamp ?? new Date().toISOString(),
      path: data.path ?? data.Path ?? error.response.config?.url ?? null,
    };
  }

  // Network or unexpected client-side error
  const message = error?.message || "Unexpected client error.";

  return {
    success: false,
    message,
    errors: { general: [message] },
    statusCode: error?.code === "ECONNABORTED" ? 408 : 0, // example: map timeout to 408
    timestamp: new Date().toISOString(),
    path: null,
  };
}

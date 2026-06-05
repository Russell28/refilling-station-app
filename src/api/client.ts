import axios from "axios";
import { clearAuth, getToken, saveAuth } from "../features/auth/utils/authStorage";
import { normalizeError } from "../utils/normalizeServerErrors";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor -> attach token
apiClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor -> handle 401 refresh logic
apiClient.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

    // If no response, reject immediately
    if (!error.response) {
      return Promise.reject(error);
    }

    // Don’t try to refresh if the failing call *is* the refresh endpoint
    const isRefreshCall = originalRequest.url?.includes("/auth/refresh-token");

    if (error.response.status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;
      try {
        const refreshRes = await apiClient.post("/auth/refresh-token", {}, { withCredentials: true });
        const newAccessToken = refreshRes.data.accessToken;

        saveAuth(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


// Final interceptor -> normalize errors for UI
apiClient.interceptors.response.use(
  res => res,
  error => {
    throw normalizeError(error); // now safe to normalize
  }
);

import axios from "axios";
import { getToken } from "../features/auth/utils/authStorage";
import { normalizeError } from "../utils/normalizeServerErrors";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

// Interceptor - set the Authorization header for all requests if a token is available in localStorage
apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor - handle errors globally and normalize them
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    throw normalizeError(error);
  }
);
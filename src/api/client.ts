import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:7034/api",
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

import { apiClient } from "../../../api/client";
import type { LoginRequest, LoginResponse, MeResponse } from "../types/auth";

export async function login(request: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        request,
        { withCredentials: true } // critical for cookies
    );
    return response.data;
}

export async function getMe(): Promise<MeResponse> {
    const response = await apiClient.get<MeResponse>("/auth/me");
    return response.data;
}

export async function refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
    );
    return response.data;
}

export async function logout(): Promise<void> {
    await apiClient.post("/auth/logout", {}, { withCredentials: true });
}
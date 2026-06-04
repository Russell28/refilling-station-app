import { apiClient } from "../../../api/client";
import type { LoginRequest, LoginResponse, MeResponse } from "../types/auth";

export async function login(request: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", request);
    return response.data;
}

export async function getMe(): Promise<MeResponse> {
    const response = await apiClient.get<MeResponse>("/auth/me");
    return response.data;
}

export async function logout(): Promise<void> {
    await apiClient.post("/auth/logout");
}
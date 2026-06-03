
import { apiClient } from "../../api/client";
import type { User, CreateUserRequest } from "./User";

export async function getUsers(): Promise<User[]> {
    const response = await apiClient.get("/users");
    return response.data;
}

export async function getUserById(id: number): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
}

export async function createUser(payload: CreateUserRequest): Promise<User> {
    const response = await apiClient.post("/users", payload);
    return response.data;
}

export async function changePassword(id: number, newPassword: string): Promise<void> {
    await apiClient.post(`/users/${id}/change-password`, {
        password: newPassword
    });
}

export async function changeRole(id: number, newRole: string): Promise<void> {
    await apiClient.post(`/users/${id}/change-role`, { role: newRole });
}

export async function activateUser(id: number): Promise<void> {
    await apiClient.post(`/users/${id}/activate`);
}

export async function deactivateUser(id: number): Promise<void> {
    await apiClient.post(`/users/${id}/deactivate`);
}

export async function deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
}
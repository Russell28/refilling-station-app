import { clearAccessToken, getAccessToken, setAccessToken } from "../api/accessToken";
import { clearUserInfo, getUserInfo, setUserInfo, type AuthUser } from "../api/userInfo";

export function saveAuth(accessToken: string): void {
    setAccessToken(accessToken);
}

export function saveUserDetails(username: string, role: string): void {
    setUserInfo(username, role);
}

export function clearAuth(): void {
    clearAccessToken();
    clearUserInfo();
}

export function getToken(): string | null {
    return getAccessToken();
}

export function getStoredUser(): AuthUser | null {
    return getUserInfo();
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export function isAdmin(): boolean {
    const user = getStoredUser();
    return user?.role === "Admin";
}
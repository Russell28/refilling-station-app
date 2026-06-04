const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USERNAME_KEY = "username";
const ROLE_KEY = "role";

export type AuthUser = {
    username: string;
    role: string;
}

export function saveAuth(accessToken: string, refreshToken: string, username: string, role: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(ROLE_KEY, role);
}

export function clearAuth(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
}

export function getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
    const username = localStorage.getItem(USERNAME_KEY);
    const role = localStorage.getItem(ROLE_KEY);

    if (!username || !role) {
        return null;
    }

    return { 
        username, 
        role 
    };
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export function isAdmin(): boolean {
    const user = getStoredUser();
    return user?.role === "Admin";
}
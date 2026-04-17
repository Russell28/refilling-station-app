const TOKEN_KEY = "token";
const USERNAME_KEY = "username";
const ROLE_KEY = "role";

export type AuthUser = {
    username: string;
    role: string;
}

export function saveAuth(token: string, username: string, role: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(ROLE_KEY, role);
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
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
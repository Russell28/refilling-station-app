export type LoginRequest = {
    username: string;
    password: string;
}

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    username: string;
    role: string;
}

export type MeResponse = {
    userId: number;
    username: string;
    role: string;
}
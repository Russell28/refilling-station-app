export type LoginRequest = {
    username: string;
    password: string;
}

export type LoginResponse = {
    token: string;
    username: string;
    role: string;
}

export type MeResponse = {
    userId: number;
    username: string;
    role: string;
}
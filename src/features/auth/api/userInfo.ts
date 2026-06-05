export type AuthUser = {
    username: string | null;
    role: string | null;
}

let authUser: AuthUser = {
    username: null,
    role: null
};

export function setUserInfo(un: string, r: string) {
    authUser = { ...authUser, username: un, role: r };
}

export function getUserInfo(): AuthUser {
    return { ...authUser };
}

export function clearUserInfo() {
    authUser = { ...authUser, username: null, role: null };
}
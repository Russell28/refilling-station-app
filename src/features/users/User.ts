export interface User {
    id: number;
    username: string;
    role: string; // "Admin" | "Employee" | "ReadOnly"
    isActive: boolean;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    role: UserRole; // "Admin" | "Employee" | "ReadOnly"
}

export type UserRole = "Admin" | "Employee" | "ReadOnly";

export const userRoleOptions = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Employee" },
    { id: 3, name: "ReadOnly" }
];

export interface UserFormValues {
    username: string;
    password: string;
    role: UserRole;
}

export const emptyUserFormValues: UserFormValues = {
    username: "",
    password: "",
    role: "ReadOnly",
};

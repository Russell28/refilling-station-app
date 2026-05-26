import { apiClient } from "../../api/client";
import type { CreateUpdateExpenseRequest, Expense } from "./Expense";

export async function getExpenses() : Promise<Expense[]> {
    const response = await apiClient.get("/expenses");
    return response.data;
}

export async function createExpense(payload: CreateUpdateExpenseRequest): Promise<Expense> {
    const apiPayload = {
        ...payload,
        date: payload.date 
            ? new Date(payload.date).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
    };
    const response = await apiClient.post("/expenses", apiPayload);
    return response.data;
}

export async function updateExpense(id: number, payload: CreateUpdateExpenseRequest): Promise<Expense> {
    const apiPayload = {
        ...payload,
        date: payload.date 
            ? new Date(payload.date).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
    };
    const response = await apiClient.put(`/expenses/${id}`, apiPayload);
    return response.data;
}

export async function deleteExpense(id: number): Promise<void> {
    await apiClient.delete(`/expenses/${id}`);
}
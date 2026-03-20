import { apiClient } from "../../api/client";
import type { Expense, ExpenseFormValues } from "./Expense";

export async function getExpenses() : Promise<Expense[]> {
    const response = await apiClient.get("/expenses");
    return response.data;
}

export async function createExpense(payload: ExpenseFormValues): Promise<Expense> {
    const apiPayload = {
        ...payload,
        date: payload.date ? new Date(payload.date).toISOString() : null,
    };
    const response = await apiClient.post("/expenses", apiPayload);
    return response.data;
}

export async function updateExpense(id: number, payload: ExpenseFormValues): Promise<Expense> {
    const apiPayload = {
        ...payload,
        date: payload.date ? new Date(payload.date).toISOString() : null,
    };
    const response = await apiClient.put(`/expenses/${id}`, apiPayload);
    return response.data;
}
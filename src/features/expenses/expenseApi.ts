import { apiClient } from "../../api/client";
import type { Expense } from "./Expense";
export async function getExpenses() : Promise<Expense[]> {
    const response = await apiClient.get("/expenses");
    return response.data;
}
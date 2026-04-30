import { apiClient } from "../../api/client";
import type { ExpenseCategoryListItem } from "./ExpenseCategory";

export async function getExpenseCategoryList(): Promise<ExpenseCategoryListItem[]> {
    const response = await apiClient.get<ExpenseCategoryListItem[]>("/expense-categories/list");
    return response.data;
}
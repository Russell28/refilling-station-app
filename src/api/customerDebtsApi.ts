import { apiClient } from "./client";
import type { CustomerDebt } from "../types/CustomerDebt";

export async function getCustomerDebts(): Promise<CustomerDebt[]> {
    const response = await apiClient.get("/debt-entries");
    return response.data;
}
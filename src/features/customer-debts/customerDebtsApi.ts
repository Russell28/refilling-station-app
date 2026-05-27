import { apiClient } from "../../api/client";
import type { DateRangeSearchRequest } from "../../types/DateRangeRequest";
import type { CreateUpdateCustomerDebtRequest, CustomerDebt } from "./CustomerDebt";

export async function getCustomerDebts(): Promise<CustomerDebt[]> {
    const response = await apiClient.get("/customer-debts");
    return response.data;
}

export async function searchCustomerDebts(searchRequest: DateRangeSearchRequest): Promise<CustomerDebt[]> {
    const response = await apiClient.post("/customer-debts/search", searchRequest);
    return response.data;
}

export async function createCustomerDebt(payload: CreateUpdateCustomerDebtRequest): Promise<CustomerDebt> {
    const apiPayload = {
        ...payload,
        date: payload.date 
            ? new Date(payload.date).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
    };

    const response = await apiClient.post("/customer-debts", apiPayload);
    return response.data;
}

export async function updateCustomerDebt(id: number, payload: CreateUpdateCustomerDebtRequest): Promise<CustomerDebt> {
    const apiPayload = {
        ...payload,
        date: payload.date 
            ? new Date(payload.date).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
    };

    const response = await apiClient.put(`/customer-debts/${id}`, apiPayload);
    return response.data;
}

export async function deleteCustomerDebt(id: number): Promise<void> {
    await apiClient.delete(`/customer-debts/${id}`);
}
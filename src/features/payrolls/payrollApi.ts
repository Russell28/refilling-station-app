import { apiClient } from "../../api/client";
import type { DateRangeSearchRequest } from "../../types/DateRangeRequest";
import type { CreateUpdatePayrollRequest, Payroll } from "./Payroll";

export async function getPayrolls(): Promise<Payroll[]> {
    const response = await apiClient.get("/payrolls");
    return response.data;
}

export async function searchPayrolls(searchParams: DateRangeSearchRequest): Promise<Payroll[]> {
    const response = await apiClient.post("/payrolls/search", searchParams);
    return response.data;
}

export async function createPayroll(payload: CreateUpdatePayrollRequest): Promise<Payroll> {
    const apiPayload = {
        ...payload,
        earnedDate: payload.earnedDate 
            ? new Date(payload.earnedDate).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
        paidDate: payload.paidDate 
            ? new Date(payload.paidDate).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
    };

    const response = await apiClient.post("/payrolls", apiPayload);
    return response.data;
}

export async function updatePayroll(id: number, payload: CreateUpdatePayrollRequest): Promise<Payroll> {
    const apiPayload = {
        ...payload,
        earnedDate: payload.earnedDate 
            ? new Date(payload.earnedDate).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
        paidDate: payload.paidDate 
            ? new Date(payload.paidDate).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
    };
    const response = await apiClient.put(`/payrolls/${id}`, apiPayload);
    return response.data;
}

export async function deletePayroll(id: number): Promise<void> {
    await apiClient.delete(`/payrolls/${id}`);
}
import { apiClient } from "../../../api/client";
import type { DateRangeSearchRequest } from "../../../types/DateRangeRequest";
import type { CreateUpdatePayrollEntryRequest, PayrollEntry } from "./PayrollEntry";

export async function getPayrollEntries(): Promise<PayrollEntry[]> {
    const response = await apiClient.get("/payroll-entries");
    return response.data;
}

export async function searchPayrollEntries(searchParams: DateRangeSearchRequest): Promise<PayrollEntry[]> {
    const response = await apiClient.post("/payroll-entries/search", searchParams);
    return response.data;
}

export async function createPayrollEntry(payload: CreateUpdatePayrollEntryRequest): Promise<PayrollEntry> {
    const apiPayload = {
        ...payload,
        earnedDate: payload.earnedDate 
            ? new Date(payload.earnedDate).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
    };

    const response = await apiClient.post("/payroll-entries", apiPayload);
    return response.data;
}

export async function updatePayrollEntry(id: number, payload: CreateUpdatePayrollEntryRequest): Promise<PayrollEntry> {
    const apiPayload = {
        ...payload,
        earnedDate: payload.earnedDate 
            ? new Date(payload.earnedDate).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
    };
    const response = await apiClient.put(`/payroll-entries/${id}`, apiPayload);
    return response.data;
}

export async function deletePayrollEntry(id: number): Promise<void> {
    await apiClient.delete(`/payroll-entries/${id}`);
}
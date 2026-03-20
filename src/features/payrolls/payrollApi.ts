import { apiClient } from "../../api/client";
import type { Payroll, PayrollFormValues } from "./Payroll";

export async function getPayrolls(): Promise<Payroll[]> {
    const response = await apiClient.get("/payroll-entries");
    return response.data;
}

export async function createPayroll(payload: PayrollFormValues): Promise<Payroll> {
    const apiPayload = {
        ...payload,
        date: payload.date ? new Date(payload.date).toISOString() : null,
    };

    const response = await apiClient.post("/payroll-entries", apiPayload);
    return response.data;
}

export async function updatePayroll(id: number, payload: PayrollFormValues): Promise<Payroll> {
    const apiPayload = {
        ...payload,
        date: payload.date ? new Date(payload.date).toISOString() : null,
    };
    const response = await apiClient.put(`/payroll-entries/${id}`, apiPayload);
    return response.data;
}

export async function deletePayroll(id: number): Promise<void> {
    await apiClient.delete(`/payroll-entries/${id}`);
}
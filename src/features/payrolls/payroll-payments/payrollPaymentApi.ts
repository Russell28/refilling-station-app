import { apiClient } from "../../../api/client";
import type { DateRangeSearchRequest } from "../../../types/DateRangeRequest";
import type { CreateUpdatePayrollPaymentRequest, PayrollPayment } from "./PayrollPayment";

export async function getPayrollPayments(): Promise<PayrollPayment[]> {
    const response = await apiClient.get("/payroll-payments");
    return response.data;
}

export async function searchPayrollPayments(searchParams: DateRangeSearchRequest): Promise<PayrollPayment[]> {
    const response = await apiClient.post("/payroll-payments/search", searchParams);
    return response.data;
}

export async function createPayrollPayment(payload: CreateUpdatePayrollPaymentRequest): Promise<PayrollPayment> {
    const apiPayload = {
        ...payload,
        earnedDate: payload.paidDate 
            ? new Date(payload.paidDate).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
    };

    const response = await apiClient.post("/payroll-payments", apiPayload);
    return response.data;
}

export async function updatePayrollPayment(id: number, payload: CreateUpdatePayrollPaymentRequest): Promise<PayrollPayment> {
    const apiPayload = {
        ...payload,
        earnedDate: payload.paidDate 
            ? new Date(payload.paidDate).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
    };
    const response = await apiClient.put(`/payroll-payments/${id}`, apiPayload);
    return response.data;
}

export async function deletePayrollPayment(id: number): Promise<void> {
    await apiClient.delete(`/payroll-payments/${id}`);
}
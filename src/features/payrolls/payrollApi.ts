import { apiClient } from "../../api/client";
import type { Payroll } from "./Payroll";

export async function getPayrolls(): Promise<Payroll[]> {
    const response = await apiClient.get("/payroll-entries");
    return response.data;
}
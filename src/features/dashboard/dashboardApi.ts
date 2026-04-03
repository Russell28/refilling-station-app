import { apiClient } from "../../api/client";
import type { DashboardResponse } from "./Dashboard";

export async function getDashboard(startDate: string, endDate: string): Promise<DashboardResponse> {
    const response = await apiClient.get<DashboardResponse>("/dashboard", {
        params: {
            startDate,
            endDate
        }
    });
    return response.data;
}
    
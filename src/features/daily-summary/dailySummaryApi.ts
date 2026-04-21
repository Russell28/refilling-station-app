import { apiClient } from "../../api/client";
import type { DailySummaryResponse } from "./DailySummary";

export async function getDailySummary(date: string): Promise<DailySummaryResponse> {
    const response = await apiClient.get<DailySummaryResponse>(`/daily-summary/${date}`);
    return response.data;
}
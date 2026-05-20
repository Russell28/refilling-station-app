import { apiClient } from "../../../api/client";
import type { DailySummaryResult } from "./DailySummary";

export async function getDailySummary(date: string): Promise<DailySummaryResult> {
    const response = await apiClient.get<DailySummaryResult>(`/reports/daily-summary/${date}`);
    return response.data;
}
import { apiClient } from "../../../api/client";
import type { MonthlySummaryResponse, SaveMonthlySummaryRequest } from "./MonthlySummary";

export async function getMonthlySummary(monthYear: string) {
    var response = await apiClient.get<MonthlySummaryResponse>(`/reports/monthly-summary/${monthYear}`);

    return response.data;
}

export async function saveMonthlySummary(payload: SaveMonthlySummaryRequest) {
    var response = await apiClient.post<MonthlySummaryResponse>("/monthly-closings", payload);
    
    return response.data;
}
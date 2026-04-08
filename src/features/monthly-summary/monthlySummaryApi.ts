import { apiClient } from "../../api/client";
import type { MonthlySummaryResponse, SaveMonthlySummaryRequest, SaveMonthlySummaryResponse } from "./MonthlySummary";

export async function getMonthlySummary(month: string) {
    var response = await apiClient.get<MonthlySummaryResponse>("/monthly-summary", {
        params: { month }
    });

    return response.data;
}

export async function saveMonthlySummary(payload: SaveMonthlySummaryRequest) {
    var response = await apiClient.post<SaveMonthlySummaryResponse>("/monthly-summary", payload);
    
    return response.data;
}
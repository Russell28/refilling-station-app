export interface DateRangeSearchRequest {
    startDate?: string; // ISO format date string (YYYY-MM-DD)
    endDate?: string;   // ISO format date string (YYYY-MM-DD)
    page?: number;     // Optional pagination parameter
}
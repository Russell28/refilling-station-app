export type SavedClosing = {
    managerShare: number;
    ownerShare: number;
    notes: string | null;
    createdAt: string;
}

export type MonthlySummaryResponse = {
    month: string;
    totalCashCollected: number;
    totalExpenses: number;
    totalPayrollEarned: number;
    netProfit: number;
    savedClosing: SavedClosing | null;
}

export type SaveMonthlySummaryRequest = {
    month: string;
    managerShare: number;
    ownerShare: number;
    notes: string | null;
}

export type SaveMonthlySummaryResponse = {
    message: string;
    month: string;
    totalCashCollected: number;
    totalExpenses: number;
    totalPayrollEarned: number;
    netProfit: number;
    managerShare: number;
    ownerShare: number;
    remainingBalance: number;
}


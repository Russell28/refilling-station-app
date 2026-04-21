export type DailySummary = {
    date: string; // ISO date string (e.g. "2024-06-30")
    tripCount: number;

    backlogStartQty: number;
    totalCollectedQty: number;
    totalLoadedQty: number;
    totalDeliveredQty: number;
    backlogEndQty: number;

    totalFreeQty: number;
    totalReturnedQty: number;
    totalReplacementQty: number;

    totalCashCollected: number;
    totalExpenses: number;
    totalPayrollEarned: number;
    totalPayrollPaid: number;
    
    totalDebtCreatedToday: number;
    totalDebtPaymentsToday: number;
    outstandingDebt: number;
    
    netCashFlow: number;
}

export type DebtBreakdownItem = {
    latestTransactionDate: string;
    customerName: string;
    debtCreated: number;
    debtPayments: number;
    balance: number;
}

export type DailySummaryResponse = {
    summary: DailySummary;
    debtBreakdown: DebtBreakdownItem[];
}
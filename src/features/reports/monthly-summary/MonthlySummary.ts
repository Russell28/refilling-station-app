export interface SavedClosing {
    managerShare: number;
    ownerShare: number;
    notes: string | null;
    createdAt: string;
}

export interface SummaryTotals {
  cashCollected: number;
  debtTotal: number;
  expenseTotal: number;
  payrollEarnedTotal: number;
  payrollPaidTotal: number;
  payrollOwedTotal: number;


  netBeforePayroll: number;
  netAfterPayroll: number;
  netCashFlow: number;
}

export interface MonthlySummaryResponse {
    monthYear: string;
    summaryTotals: SummaryTotals
    savedClosing: SavedClosing | null;
}

export interface SaveMonthlySummaryRequest {
    monthYear: string;
    managerShare: number;
    ownerShare: number;
    notes: string | null;
}

export interface SaveMonthlySummaryResponse {
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


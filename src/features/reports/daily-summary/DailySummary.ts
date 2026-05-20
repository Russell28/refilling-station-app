import type { ExpenseBreakdown, DebtBreakdown, PayrollBreakdown } from "../breakdowns";

export type DailySummaryResult =
  | DailySummaryResponse
  | DailySummaryAdminResponse;
  
export type DailySummaryInfo = {
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
    
    totalDebtCreatedToday: number;
    totalDebtPaymentsToday: number;
    outstandingDebt: number;
    
    cashAfterExpense: number;
}

export type DailySummaryResponse = {
    summary: DailySummaryInfo;
    expenseBreakdown: ExpenseBreakdown;
    debtBreakdown: DebtBreakdown;
}

export type DailySummaryInfoAdmin = {
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
    
    cashAfterExpense: number;
    cashAfterPayroll: number;
}

export type DailySummaryAdminResponse = {
    summary: DailySummaryInfoAdmin;
    expenseBreakdown: ExpenseBreakdown;
    debtBreakdown: DebtBreakdown;
    payrollBreakdown: PayrollBreakdown;
}
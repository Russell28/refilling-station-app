import type { ExpenseBreakdown, DebtBreakdown, PayrollBreakdown } from "../breakdowns";

export type DailySummaryResult =
  | DailySummaryResponse
  | DailySummaryAdminResponse;
  
export type DailySummaryInfo = {
    date: string; // ISO date string (e.g. "2024-06-30")
    tripCount: number;

    backlogStartQty: number;
    collectedQtyTotal: number;
    loadedQtyTotal: number;
    deliveredQtyTotal: number;
    backlogEndQty: number;

    freeQtyTotal: number;
    returnedQtyTotal: number;
    replacementQtyTotal: number;

    cashCollectedTotal: number;
    expensesTotal: number;
    
    debtCreatedTodayTotal: number;
    debtPaymentsTodayTotal: number;
    outstandingDebt: number;
    
    netBeforePayroll: number;
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
    collectedQtyTotal: number;
    loadedQtyTotal: number;
    deliveredQtyTotal: number;
    backlogEndQty: number;

    freeQtyTotal: number;
    returnedQtyTotal: number;
    replacementQtyTotal: number;

    cashCollectedTotal: number;
    expensesTotal: number;
    payrollEarnedTotal: number;
    payrollPaidTotal: number;
    
    debtCreatedTodayTotal: number;
    debtPaymentsTodayTotal: number;
    outstandingDebt: number;
    
    netBeforePayroll: number;
    netAfterPayroll: number;
}

export type DailySummaryAdminResponse = {
    summary: DailySummaryInfoAdmin;
    expenseBreakdown: ExpenseBreakdown;
    debtBreakdown: DebtBreakdown;
    payrollBreakdown: PayrollBreakdown;
}
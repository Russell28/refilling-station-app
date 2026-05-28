import type { ExpenseBreakdown, DebtBreakdown, PayrollBreakdown } from "../breakdowns";

export interface Dashboard {
    backlogStartQty: number;
    backlogEndQty: number;

    totalTrips: number;
    totalCollectedQty: number;
    totalDeliveredQty: number;

    totalExpense: number;
    
    totalPayrollEarned: number;
    totalPayrollPaid: number;
    outstandingPayroll: number;
    
    totalDebtCreated: number;
    totalDebtPayments: number;
    outstandingDebt: number;
    
    totalCashCollected: number;
    netAfterExpense: number;
    netAfterPayroll: number;

    costPerGallon: number;
    retailPerGallon: number;
    profitPerGallon: number;
}
export interface DailyReport {
    date: string;

    backlogStartQty: number;
    backlogEndQty: number;

    tripCount: number;
    
    totalCollectedQty: number;
    totalDeliveredQty: number;
    totalFreeQty: number;

    totalExpenses: number;

    totalPayrollEarned: number;
    totalPayrollPaid: number;

    totalDebtCreated: number;
    totalDebtPayment: number;

    totalCashCollected: number;
    cashAfterExpense: number;
    cashAfterPayroll: number;
};

export interface DashboardResponse {
    summary: Dashboard;
    dailyReports: DailyReport[];
    expenseBreakdown: ExpenseBreakdown;
    debtBreakdown: DebtBreakdown;
    payrollBreakdown: PayrollBreakdown;
}
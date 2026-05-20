import type { ExpenseBreakdown, DebtBreakdown, PayrollBreakdown } from "../breakdowns";

export type Dashboard = {
    totalTrips: number;
    backlogStartQty: number;
    totalCollectedQty: number;
    totalLoadedQty: number;
    totalDeliveredQty: number;
    backlogEndQty: number;

    totalCashCollected: number;
    totalExpenses: number;
    totalPayrollPaid: number;
    netCashFlow: number;

    totalDebtCreated: number;
    totalDebtPayments: number;
    outstandingDebt: number;

    totalSalaryEarned: number;
    payrollPaid: number;
    payrollOwed: number;
    outstandingPayroll: number;
}

export type DailyReport = {
    date: string;
    tripCount: number;
    collectedQty: number;
    deliveredQty: number;
    cashCollected: number;
    expenses: number;
    payrollPaid: number;
    debtCreated: number;
    debtPayments: number;
    netCashFlow: number;
    backlogEndQty: number;
};



export type DashboardResponse = {
    summary: Dashboard;
    dailyReports: DailyReport[];
    expenseBreakdown: ExpenseBreakdown;
    debtBreakdown: DebtBreakdown;
    payrollBreakdown: PayrollBreakdown;
}
import type { ExpenseBreakdown, DebtBreakdown, PayrollBreakdown } from "../breakdowns";

export interface Dashboard {
    backlogStartQty: number;
    backlogEndQty: number;

    tripCount: number;
    collectedQtyTotal: number;
    deliveredQtyTotal: number;

    expensesTotal: number;
    
    payrollEarnedTotal: number;
    payrollPaidTotal: number;
    outstandingPayroll: number;
    
    debtCreatedTotal: number;
    debtPaymentsTotal: number;
    outstandingDebt: number;
    
    cashCollectedTotal: number;
    netBeforePayroll: number;
    netAfterPayroll: number;
    netCashFlow: number;

    costPerGal: number;
    retailPerGal: number;
    profitPerGal: number;
    salaryPaidPerGal: number;
}
export interface DailyReport {
    date: string;

    backlogStartQty: number;
    backlogEndQty: number;

    tripCountPerDay: number;
    
    collectedQtyPerDay: number;
    deliveredQtyPerDay: number;
    freeQtyPerDay: number;
    returnedQtyPerDay: number;
    replacementQtyPerDay: number;

    expensesTotalPerDay: number;

    payrollEarnedTotalPerDay: number;
    payrollPaidTotalPerDay: number;

    debtCreatedPerDay: number;
    debtPaymentsPerDay: number;

    cashCollectedTotalPerDay: number;
    netBeforePayrollPerDay: number;
    netAfterPayrollPerDay: number;
};

export interface DashboardResponse {
    summary: Dashboard;
    dailyReports: DailyReport[];
    expenseBreakdown: ExpenseBreakdown;
    debtBreakdown: DebtBreakdown;
    payrollBreakdown: PayrollBreakdown;
}
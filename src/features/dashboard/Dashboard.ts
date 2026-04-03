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

export type ExpenseBreakdownItem = {
    category: string;
    amount: number;
}

export type DebtBreakdownItem = {
    customerName: string;
    debtCreated: number;
    debtPayments: number;
    balance: number;
}

export type PayrollBreakdownItem  = {
    employeeName: string;
    salaryEarned: number;
    cashPaid: number;
    balance: number;
}

export type DashboardResponse = {
    summary: Dashboard;
    dailyReports: DailyReport[];
    expenseBreakdown: ExpenseBreakdownItem[];
    debtBreakdown: DebtBreakdownItem[];
    payrollBreakdown: PayrollBreakdownItem[];
}
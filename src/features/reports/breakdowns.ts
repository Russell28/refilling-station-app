export type ExpenseBreakdown = {
    totalExpense: number;
    items: ExpenseBreakdownItem[]
}

export type DebtBreakdown = {
    totalDebt: number;
    items: DebtBreakdownItem[]
}

export type PayrollBreakdown = {
    totalEarned: number;
    totalPaid: number;
    totalOwed: number;
    items: PayrollBreakdownItem[]
}

export type ExpenseBreakdownItem = {
    expenseCategoryId: number
    categoryName: string;
    amount: number;
    dailyAverage: number;
}

export type DebtBreakdownItem = {
    customerId: number;
    customerName: string;
    debtCreated: number;
    debtPayment: number;
    balance: number;
    latestTransactionDate: string
}

export type PayrollBreakdownItem  = {
    employeeId: number
    employeeName: string;
    earned: number;
    paid: number;
    owed: number;
}
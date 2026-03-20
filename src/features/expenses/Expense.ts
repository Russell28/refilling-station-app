export type Expense = {
    id: number;
    date: string; // ISO format date string
    expenseCategory: string;
    amount: number;
    notes: string;
};

export type ExpenseFormValues = {
    date: string; // ISO format date string
    expenseCategory: string;
    amount: number;
    notes: string;
};

export const emptyExpenseFormValues: ExpenseFormValues = {
    date: "",
    expenseCategory: "",
    amount: 0,
    notes: "",
};
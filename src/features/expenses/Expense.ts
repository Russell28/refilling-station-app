export type Expense = {
    id: number;
    date: string; // ISO format date string
    expenseCategoryId: number;
    expenseCategory: string;
    amount: number;
    notes: string;
};

export type ExpenseFormValues = {
    date: string; // ISO format date string
    expenseCategoryId: string;
    amount: string;
    notes: string;
};

export const emptyExpenseFormValues: ExpenseFormValues = {
    date: new Date().toISOString().split("T")[0], // Default to today's date in YYYY-MM-DD format
    expenseCategoryId: '', 
    amount: "",
    notes: "",
};

export type CreateUpdateExpenseRequest = {
    date: string; // ISO format date string
    expenseCategoryId: number;
    amount: number;
    notes: string;
};

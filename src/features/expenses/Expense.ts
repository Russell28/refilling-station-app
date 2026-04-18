import { EXPENSE_CATEGORIES } from "../constants/constants";

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
    date: new Date().toISOString().split("T")[0], // Default to today's date in YYYY-MM-DD format
    expenseCategory: EXPENSE_CATEGORIES.length > 0 ? EXPENSE_CATEGORIES[0].name : '', // Default to first category if available otherwise empty string
    amount: 0,
    notes: "",
};
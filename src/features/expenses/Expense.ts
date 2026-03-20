export type Expense = {
    id: number;
    date: string; // ISO format date string
    category: string;
    amount: number;
    notes: string;
};
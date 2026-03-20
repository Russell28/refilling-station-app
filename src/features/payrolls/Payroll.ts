export type Payroll = {
    id: number;
    date: string; // ISO date string (e.g. "2024-06-30")
    employee: string;
    salary: number;
    advanceGiven: number;
    advanceDeduction: number;
    cashPaid: number;
    notes?: string;
};

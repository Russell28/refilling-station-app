
export type PayrollEntry = {
    id: number;
    earnedDate: string; // ISO date string (e.g. "2024-06-30")
    employeeId: number;
    employeeName: string;
    salaryAmount: number;
    notes: string | null;
};

export type PayrollEntryFormValues = {
    earnedDate: string;
    employeeId: string;
    salaryAmount: string;
    notes?: string;
};

export const emptyPayrollFormValues: PayrollEntryFormValues = {
    earnedDate: new Date().toISOString().split("T")[0], // Default to today's date in YYYY-MM-DD format
    employeeId: '', 
    salaryAmount: '',
    notes: ''
};

export type CreateUpdatePayrollEntryRequest = {
    earnedDate: string;
    employeeId: number;
    salaryAmount: number;
    notes?: string;
};

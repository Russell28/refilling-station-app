
export type Payroll = {
    id: number;
    earnedDate: string; // ISO date string (e.g. "2024-06-30")
    employeeId: number;
    employeeName: string;
    salaryAmount: number;
    notes: string | null;
};

export type PayrollFormValues = {
    earnedDate: string;
    employeeId: string;
    salaryAmount: string;
    notes?: string;
};

export const emptyPayrollFormValues: PayrollFormValues = {
    earnedDate: new Date().toISOString().split("T")[0], // Default to today's date in YYYY-MM-DD format
    employeeId: '', 
    salaryAmount: '',
    notes: ''
};

export type CreateUpdatePayrollRequest = {
    earnedDate: string;
    employeeId: number;
    salaryAmount: number;
    notes?: string;
};

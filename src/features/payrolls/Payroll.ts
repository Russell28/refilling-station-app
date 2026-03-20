export type Payroll = {
    id: number;
    date: string; // ISO date string (e.g. "2024-06-30")
    employeeName: string;
    salaryAmount: number;
    advanceGiven: number;
    advanceDeduction: number;
    cashPaid: number;
    notes?: string;
};

export type PayrollFormValues = {
    date: string;
    employeeName: string;
    salaryAmount: number;
    advanceGiven: number;
    advanceDeduction: number;
    cashPaid: number;
    notes?: string;
};

export const emptyPayrollFormValues: PayrollFormValues = {
    date: '',
    employeeName: '',
    salaryAmount: 0,
    advanceGiven: 0,
    advanceDeduction: 0,
    cashPaid: 0,
    notes: ''
};

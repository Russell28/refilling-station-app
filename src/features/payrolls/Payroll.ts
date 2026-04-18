import { EMPLOYEES } from "../constants/constants";

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
    salaryAmount: string;
    advanceGiven: string;
    advanceDeduction: string;
    cashPaid: string;
    notes?: string;
};

export const emptyPayrollFormValues: PayrollFormValues = {
    date: new Date().toISOString().split("T")[0], // Default to today's date in YYYY-MM-DD format
    employeeName: EMPLOYEES.length > 0 ? EMPLOYEES[0].name : '', // Default to first employee if available otherwise empty string
    salaryAmount: '',
    advanceGiven: '',
    advanceDeduction: '',
    cashPaid: '',
    notes: ''
};

export type CreateUpdatePayrollRequest = {
    date: string;
    employeeName: string;
    salaryAmount: number;
    advanceGiven: number;
    advanceDeduction: number;
    cashPaid: number;
    notes?: string;
};

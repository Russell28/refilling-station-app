import { EMPLOYEES } from "../constants/constants";

export type Payroll = {
    id: number;
    earnedDate: string; // ISO date string (e.g. "2024-06-30")
    paidDate: string | null; // ISO date string (e.g. "2024-07-01")
    employeeName: string;
    salaryAmount: number;
    cashPaid: number;
    notes: string | null;
};

export type PayrollFormValues = {
    earnedDate: string;
    paidDate: string;
    employeeName: string;
    salaryAmount: string;
    cashPaid: string;
    notes?: string;
};

export const emptyPayrollFormValues: PayrollFormValues = {
    earnedDate: new Date().toISOString().split("T")[0], // Default to today's date in YYYY-MM-DD format
    paidDate: "", 
    employeeName: EMPLOYEES.length > 0 ? EMPLOYEES[0].name : '', // Default to first employee if available otherwise empty string
    salaryAmount: '',
    cashPaid: '',
    notes: ''
};

export type CreateUpdatePayrollRequest = {
    earnedDate: string;
    paidDate: string | null;
    employeeName: string;
    salaryAmount: number;
    cashPaid: number;
    notes?: string;
};

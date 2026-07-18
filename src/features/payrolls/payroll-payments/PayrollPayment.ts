
export type PayrollPayment = {
    id: number;
    employeeId: number;
    employeeName: string;
    paidDate: string; // ISO date string (e.g. "2024-06-30")
    amountPaid: number;
    notes: string | null;
};

export type PayrollPaymentFormValues = {
    employeeId: string;
    paidDate: string;
    amountPaid: string;
    notes?: string;
};

export const emptyPaymentFormValues: PayrollPaymentFormValues = {
    employeeId: '', 
    paidDate: new Date().toISOString().split("T")[0], // Default to today's date in YYYY-MM-DD format
    amountPaid: '',
    notes: ''
};

export type CreateUpdatePayrollPaymentRequest = {
    employeeId: number;
    paidDate: string;
    amountPaid: number;
    notes?: string;
};

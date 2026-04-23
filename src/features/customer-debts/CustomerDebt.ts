export type CustomerDebt = {
    id: number;
    date: string;
    customerName: string;
    customerId: number;
    amount: number;
    relatedTripId?: number; // nullable in backend
    notes: string;
};

export type CustomerDebtFormValues = {
    date: string;
    // customerName: string;
    customerId: string;
    amount: string; // Changed to string to match the input type
    relatedTripId?: string; // optional because it can be null in backend
    notes: string;
};

export const emptyForm: CustomerDebtFormValues = {
    date: new Date().toISOString().split("T")[0],
    // customerName: '', 
    customerId: '',
    amount: "",
    relatedTripId: undefined,
    notes: "",
};

export type CreateUpdateCustomerDebtRequest = {
    date: string;
    // customerName: string;
    customerId: number;
    amount: number;
    relatedTripId?: number;
    notes?: string;
};
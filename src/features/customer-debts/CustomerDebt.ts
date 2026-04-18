import { CUSTOMERS } from "../constants/constants";

export type CustomerDebt = {
    id: number;
    date: string;
    customerName: string;
    amount: number;
    relatedTripId?: number; // nullable in backend
    notes: string;
};

export type CustomerDebtFormValues = {
    date: string;
    customerName: string;
    amount: string; // Changed to string to match the input type
    relatedTripId?: string; // optional because it can be null in backend
    notes: string;
};

export const emptyForm: CustomerDebtFormValues = {
    date: new Date().toISOString().split("T")[0],
    customerName: CUSTOMERS.length > 0 ? CUSTOMERS[0].name : '', // Default to first customer if available otherwise empty string
    amount: "",
    relatedTripId: undefined,
    notes: "",
};

export type CreateUpdateCustomerDebtRequest = {
    date: string;
    customerName: string;
    amount: number;
    relatedTripId?: number;
    notes?: string;
};
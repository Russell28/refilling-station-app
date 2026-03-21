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
    amount: number;
    relatedTripId?: number; // optional because it can be null in backend
    notes: string;
};

export const emptyForm: CustomerDebtFormValues = {
    date: "",
    customerName: "",
    amount: 0,
    relatedTripId: undefined,
    notes: "",
};
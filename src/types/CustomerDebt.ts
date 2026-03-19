export type CustomerDebt = {
    id: number;
    date: string;
    customerName: string;
    amount: number;
    relatedTripId?: number; // nullable in backend
    notes: string;
};
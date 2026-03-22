export type Trip = {
  id: number;
  // Trip Info
  date: string;              // maps to DateTime Date
  tripNumber: number;
  segment: string;
  source: string;
  tripType: string;
  employeeName: string;
  customerCategory: string;
  notes: string;
  adjustmentReason: string;
  relatedTripId?: number;    // nullable in backend
  timeStarted?: string;      // DateTime? -> optional string
  timeEnded?: string;        // DateTime? -> optional string
  // Quantities
  collectedQty: number;
  loadedQty: number;
  deliveredQty: number;
  freeQty: number;
  toBePaidQty: number;
  actualPaidQty: number;
  returnedQty: number;
  replacementQty: number;
  // Payments
  pricePerGallon: number;
  estimatedCash: number;     // [NotMapped] computed in backend
  actualCashCollected: number;
};

export type TripFormValues = {
  date: string;
  tripNumber: number;
  segment: string;
  source: string;
  tripType: string;
  employeeName: string;
  customerCategory: string;
  timeStarted: string;
  timeEnded: string;
  collectedQty: number;
  loadedQty: number;
  deliveredQty: number;
  freeQty: number;
  toBePaidQty: number;
  actualPaidQty: number;
  actualCashCollected: number;
  returnedQty: number;
  replacementQty: number;
  notes: string;
  adjustmentReason: string;
};

// Default values for "create"
export const emptyTripForm: TripFormValues = {
  date: "",
  tripNumber: 0,
  segment: "",
  source: "",
  tripType: "",
  employeeName: "",
  customerCategory: "",
  timeStarted: "",
  timeEnded: "",
  collectedQty: 0,
  loadedQty: 0,
  deliveredQty: 0,
  freeQty: 0,
  toBePaidQty: 0,
  actualPaidQty: 0,
  actualCashCollected: 0,
  returnedQty: 0,
  replacementQty: 0,
  notes: "",
  adjustmentReason: "",
};

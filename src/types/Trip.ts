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
export type Trip = {
  id: number;
  // Trip Info
  date: string;              // maps to DateTime Date
  tripNumber: number;
  segment: string;
  timeStarted?: string;      // DateTime? -> optional string
  timeEnded?: string;        // DateTime? -> optional string
  source: string;
  tripType: string;
  employeeName: string;
  customerCategory: string;

  // Quantities
  collectedQty: number;
  loadedQty: number;
  deliveredQty: number;
  freeQty: number;
  actualPaidQty: number;
  returnedQty: number;
  replacementQty: number;
 
  // Payments
  actualCashCollected: number;
  isRemitted: boolean;
  
  //Notes
  relatedTripId?: number;    // nullable in backend
  notes: string;
};

export type TripFormValues = {
  date: string;
  tripNumber: number;
  segment: string;
  timeStarted: string;
  timeEnded: string;
  source: string;
  tripType: string;
  employeeName: string;
  customerCategory: string;

  collectedQty: number;
  loadedQty: number;
  deliveredQty: number;
  freeQty: number;
  actualPaidQty: number;
  returnedQty: number;
  replacementQty: number;

  actualCashCollected: number;

  notes: string;
};

// Default values for "create"
export const emptyTripForm: TripFormValues = {
  date: "",
  tripNumber: 0,
  segment: "",
  timeStarted: "",
  timeEnded: "",
  source: "",
  tripType: "",
  employeeName: "",
  customerCategory: "",
  
  collectedQty: 0,
  loadedQty: 0,
  deliveredQty: 0,
  freeQty: 0,
  actualPaidQty: 0,
  returnedQty: 0,
  replacementQty: 0,

  actualCashCollected: 0,

  notes: "",
};

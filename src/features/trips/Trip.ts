export type Trip = {
  id: number;
  // Trip Info
  date: string;              // maps to DateTime Date
  tripNumber: number;
  timeStarted?: string;      // DateTime? -> optional string
  timeEnded?: string;        // DateTime? -> optional string
  employeeName: string;
  source?: string;
  tripType?: string;
  customerCategory?: string;

  // Quantities
  collectedQty: number;
  loadedQty: number;
  deliveredQty: number;
  freeQty: number;
  returnedQty: number;
  replacementQty: number;
 
  // Payments
  actualCashCollected: number;
  isRemitted: boolean;
  notes: string;
};

export type TripFormValues = {
  date: string;
  tripNumber: string;
  timeStarted: string;
  employeeName: string;
  timeEnded: string;
  source: string;
  tripType: string;
  customerCategory: string;

  collectedQty: string;
  loadedQty: string;
  deliveredQty: string;
  freeQty: string;
  returnedQty: string;
  replacementQty: string;

  actualCashCollected: string;
  isRemitted: boolean;
  notes: string;
};

// Default values for "create"
export const emptyTripForm: TripFormValues = {
  date: "",
  tripNumber: "",
  timeStarted: "",
  timeEnded: "",
  source: "",
  tripType: "",
  employeeName: "",
  customerCategory: "",
  
  collectedQty: "0",
  loadedQty: "0",
  deliveredQty: "0",
  freeQty: "0",
  returnedQty: "0",
  replacementQty: "0",

  actualCashCollected: "0",
  isRemitted: false,
  notes: "",
};

export type CreateTripRequest = {
    date: string;
    tripNumber: number;

    timeStarted: string | null;
    timeEnded: string | null;

    employeeName: string;
    source: string | null;
    tripType: string | null;
    customerCategory: string | null;

    collectedQty: number;
    loadedQty: number;
    deliveredQty: number;
    freeQty: number;
    returnedQty: number;
    replacementQty: number;

    actualCashCollected: number;
    notes: string | null;
};

export type UpdateTripRequest = {
    date: string;
    tripNumber: number;

    timeStarted: string | null;
    timeEnded: string | null;

    employeeName: string;
    source: string | null;
    tripType: string | null;
    customerCategory: string | null;

    collectedQty: number;
    loadedQty: number;
    deliveredQty: number;
    freeQty: number;
    returnedQty: number;
    replacementQty: number;

    actualCashCollected: number;
    isRemitted: boolean;
    notes: string | null;
};


export type TripFormErrors = Partial<Record<keyof TripFormValues, string>>

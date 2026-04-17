import { CUSTOMER_CATEGORIES } from "../customer-categories/constants";
import { EMPLOYEES } from "../employees/constants";

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
  date: new Date().toISOString().split("T")[0],
  tripNumber: "",
  timeStarted: "",
  timeEnded: "",
  source: "",
  tripType: "",
  employeeName: EMPLOYEES.length > 0 ? EMPLOYEES[0].name : "",
  customerCategory: CUSTOMER_CATEGORIES.length > 0 ? CUSTOMER_CATEGORIES[0].name : "",
  
  collectedQty: "",
  loadedQty: "",
  deliveredQty: "",
  freeQty: "",
  returnedQty: "",
  replacementQty: "",

  actualCashCollected: "",
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

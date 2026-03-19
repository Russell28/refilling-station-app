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
  returnedQty: number;
  replacementQty: number;
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
  returnedQty: 0,
  replacementQty: 0,
};

export interface Customer {
  id: number;
  name: string;
}

export interface CustomerListItem {
  id: number;
  name: string;
}

export type CustomerFormValues = {
  name: string;
};

export const emptyForm: CustomerFormValues = {
  name: '',
};

export type CreateUpdateCustomerRequest = {
  name: string;
};
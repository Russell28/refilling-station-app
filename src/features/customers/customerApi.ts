import type { CustomerListItem, Customer, CreateUpdateCustomerRequest } from "./Customer";
import { apiClient } from "../../api/client";

export async function getCustomers(): Promise<CustomerListItem[]> {
  const response = await apiClient.get<CustomerListItem[]>("/customers");
  return response.data;
}

export async function getAllCustomers(): Promise<Customer[]> {
  const response = await apiClient.get<Customer[]>("/customers");
  return response.data;
}

export async function createCustomer(payload: CreateUpdateCustomerRequest): Promise<Customer> {
  const response = await apiClient.post("/customers", payload);
  return response.data;
}

export async function updateCustomer(id: number, payload: CreateUpdateCustomerRequest): Promise<Customer> {
  const response = await apiClient.put(`/customers/${id}`, payload);
  return response.data;
}

export async function deleteCustomer(id: number): Promise<void> {
  await apiClient.delete(`/customers/${id}`);
}
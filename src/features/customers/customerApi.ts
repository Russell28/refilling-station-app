import type { CustomerListItem } from "./Customer";
import { apiClient } from "../../api/client";

export async function getCustomers(): Promise<CustomerListItem[]> {
  const response = await apiClient.get<CustomerListItem[]>("/customers");
  return response.data;
}
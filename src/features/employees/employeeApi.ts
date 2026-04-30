import { apiClient } from "../../api/client";
import type { EmployeeListItem } from "./Employee";

export async function getEmployeeList(): Promise<EmployeeListItem[]> {
    const response = await apiClient.get<EmployeeListItem[]>("/employees/list");
    return response.data;
}
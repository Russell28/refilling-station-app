import { apiClient } from "../../api/client";
import type { CreateEmployeeRequest, Employee, EmployeeListItem } from "./Employee";

export async function getEmployeeList(): Promise<EmployeeListItem[]> {
    const response = await apiClient.get<EmployeeListItem[]>("/employees/active");
    return response.data;
}

export async function getAllEmployees(): Promise<Employee[]> {
    const response = await apiClient.get<Employee[]>("/employees");
    return response.data;
}

export async function createEmployee(payload: CreateEmployeeRequest): Promise<void> {
    await apiClient.post<CreateEmployeeRequest>("/employees", payload);
}

export async function updateEmployee(employeeId: number, payload: CreateEmployeeRequest): Promise<void> {
    await apiClient.put<CreateEmployeeRequest>(`/employees/${employeeId}`, payload);
}

export async function activateEmployee(employeeId: number): Promise<void> {
    await apiClient.post(`/employees/${employeeId}/activate`);
}

export async function deactivateEmployee(employeeId: number): Promise<void> {
    await apiClient.post(`/employees/${employeeId}/deactivate`);
}

export async function deleteEmployee(employeeId: number): Promise<void> {
    await apiClient.delete(`/employees/${employeeId}`);
}

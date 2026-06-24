export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  employmentType: string;
  role: string;
  isActive: boolean;
  deactivatedAt: Date | null;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: number;
  employmentType: number;
}

export interface EmployeeFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  employmentType: string;
}

export interface EmployeeListItem {
  id: number;
  name: string;
}

export const employeeRoleOptions = [
  { id: 1, name: "Manager" },
  { id: 2, name: "Supervisor" },
  { id: 3, name: "DeliveryRider" },
  { id: 4, name: "Refiller" }
];

export const employmentTypeOptions = [
    { id: 1, name: "Permanent" },
    { id: 2, name: "OnCall" },
];

export const emptyEmployeeFormValues: EmployeeFormValues = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  role: employeeRoleOptions[0].id.toString(),
  employmentType: employmentTypeOptions[0].id.toString(),
}

import { createContext, useContext, useEffect, useState } from "react";
import type { EmployeeListItem } from "./Employee";
import { getEmployeeList } from "./employeeApi";

const EmployeeContext = createContext<EmployeeListItem[]>([]);
export function EmployeeProvider({ children }: { children: React.ReactNode }) {
    const [employees, setEmployees] = useState<EmployeeListItem[]>([]);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const employeeList = await getEmployeeList();
                setEmployees(employeeList);
            } catch (error) {
                console.error("Error fetching employee list:", error);
            }
        };

        loadEmployees();
    }, []);

    return (
        <EmployeeContext.Provider value={employees}>
            {children}
        </EmployeeContext.Provider>
    );
}

export function useEmployees() {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error("useEmployees must be used within an EmployeeProvider");
    }
    return context;
}
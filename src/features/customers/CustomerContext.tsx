import { createContext, useContext, useEffect, useState } from "react";
import type { CustomerListItem } from "./Customer";
import { getCustomerList } from "./customerApi";

const CustomerContext = createContext<CustomerListItem[]>([]);
export function CustomerProvider({ children }: { children: React.ReactNode }) {
    const [customers, setCustomers] = useState<CustomerListItem[]>([]);

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const data = await getCustomerList();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to load customers:", error);
            }
        };
        loadCustomers();
    }, []);

    return (
        <CustomerContext.Provider value={customers}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomers() {
    return useContext(CustomerContext);
}
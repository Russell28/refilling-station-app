import { createContext, useContext, useEffect, useState } from "react";
import type { ExpenseCategoryListItem } from "./ExpenseCategory";
import { getExpenseCategoryList } from "./expenseCategoryApi";

const ExpenseCategoryContext = createContext<ExpenseCategoryListItem[]>([]);
export function ExpenseCategoryProvider({ children }: { children: React.ReactNode }) {
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoryListItem[]>([]);
    useEffect(() => {
        const loadExpenseCategories = async () => {
            try {
                const categories = await getExpenseCategoryList();
                setExpenseCategories(categories);
            } catch (error) {
                console.error("Error fetching expense categories:", error);
            }
        };
        loadExpenseCategories();
    }, []);

    return (
        <ExpenseCategoryContext.Provider value={expenseCategories}>
            {children}
        </ExpenseCategoryContext.Provider>
    );
}

export function useExpenseCategories() {
    const context = useContext(ExpenseCategoryContext);
    if (!context) {
        throw new Error("useExpenseCategories must be used within an ExpenseCategoryProvider");
    }
    return context;
}
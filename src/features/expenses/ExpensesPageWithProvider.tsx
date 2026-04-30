import { ExpenseCategoryProvider } from "../expense-category/ExpenseCategoryContext";
import ExpensesPage  from "./ExpensesPage";
export default function ExpensesPageWithProvider() {
    return (
        <ExpenseCategoryProvider>
            <ExpensesPage />
        </ExpenseCategoryProvider>
    );
}
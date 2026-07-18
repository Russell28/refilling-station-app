import { EmployeeProvider } from "../../employees/EmployeeContext";
import PayrollsPage from "./PayrollEntriesPage";

export default function PayrollsPageWithProvider() {
    return (
        <EmployeeProvider>
            <PayrollsPage />
        </EmployeeProvider>
    );
}
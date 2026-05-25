import { EmployeeProvider } from "../employees/EmployeeContext";
import PayrollsPage from "./PayrollsPage";

export default function PayrollsPageWithProvider() {
    return (
        <EmployeeProvider>
            <PayrollsPage />
        </EmployeeProvider>
    );
}
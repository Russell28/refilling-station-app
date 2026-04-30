import { EmployeeProvider } from "../employees/EmployeeContext";
import TripsFormPage from "./TripsFormPage";

export default function TripsFormPageWithProvider() {
    return (
        <EmployeeProvider>
            <TripsFormPage />
        </EmployeeProvider>
    );
}

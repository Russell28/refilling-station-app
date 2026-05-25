import { CustomerProvider } from "../customers/CustomerContext"
import CustomerDebtPage from "./CustomerDebtPage"

export default function CustomerDebtPageWithProvider() {
    return (
        <CustomerProvider>
            <CustomerDebtPage />
        </CustomerProvider>
    )
}
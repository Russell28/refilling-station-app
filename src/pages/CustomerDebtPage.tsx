import { useEffect, useState } from "react";
import type { CustomerDebt } from "../types/CustomerDebt";
import { getCustomerDebts } from "../api/customerDebtsApi";
import CustomerDebtForm from "../components/CustomerDebtForm";

export default function CustomerDebtPage() {
    const [customerDebts, setCustomerDebts] = useState<CustomerDebt[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const loadDebts = async () => {
            try {
                setLoading(true);
                const debts = await getCustomerDebts();
                setCustomerDebts(debts);
            } catch (err) {
                setError("Failed to load customer debts.");
            } finally {
                setLoading(false);
            }
        }
        loadDebts();
    }, []); // [] run once on first load

    function onAddClick() {
        setIsFormOpen(true);
        console.log("Add new debt");
    }

    function onEditClick(debt: CustomerDebt) {
        setIsFormOpen(true);
        console.log("Edit debt:", debt);
    }

    if (loading) {
        return <p>Loading customer debts...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }
    return (
        <div>
            <h1>Customer Debt Entries</h1>
            <button onClick={onAddClick}>New Debt</button>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Related Trip</th>
                        <th>Notes</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {customerDebts.map((debt) => (
                        <tr key={debt.id}>
                            <td>{new Date(debt.date).toLocaleDateString()}</td>
                            <td>{debt.customerName}</td>
                            <td>{debt.amount}</td>
                            <td>{debt.relatedTripId}</td>
                            <td>{debt.notes}</td>
                            <td>
                                <button onClick={() => onEditClick(debt)}>Edit</button>
                                <button onClick={() => console.log("Delete debt:", debt)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
            
            {isFormOpen && (
                <CustomerDebtForm 
                    onSubmit={(values) => console.log("Form submitted with values:", values)}
                    onCancel={() => {
                        console.log("Form cancelled");
                        setIsFormOpen(false);
                    }}
                />
            )}
        </div>
    );
}
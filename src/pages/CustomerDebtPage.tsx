import { useEffect, useState } from "react";
import type { CustomerDebt, CustomerDebtFormValues } from "../types/CustomerDebt";
import { createCustomerDebt, getCustomerDebts, updateCustomerDebt } from "../api/customerDebtsApi";
import CustomerDebtForm from "../components/CustomerDebtForm";

export default function CustomerDebtPage() {
    const [customerDebts, setCustomerDebts] = useState<CustomerDebt[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<CustomerDebt | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

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
        setSelectedDebt(null); // clear any selected debt when adding new
        setIsFormOpen(true);
    }

    function onEditClick(debt: CustomerDebt) {
        setSelectedDebt(debt);
        setIsFormOpen(true);
        console.log("Edit debt:", selectedDebt);
    }

    function onCancelClick() {
        setSelectedDebt(null);
        setIsFormOpen(false);
    }

    async function handleSubmit(formValues: CustomerDebtFormValues) {
        try {
            setSaving(true);
            if (selectedDebt) {
                await updateCustomerDebt(selectedDebt.id, formValues);
            } else {
                await createCustomerDebt(formValues);
            }

            // refresh list after save
            const debts = await getCustomerDebts();
            setCustomerDebts(debts);
            setIsFormOpen(false);
            setSelectedDebt(null);
        } catch (err) {
            setFormError("Failed to save customer debt.");
        } finally {
            setSaving(false);
        }

    }



    if (loading) {
        return <p>Loading customer debts...</p>;
    }
    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
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

            <p>{saving ? "Saving..." : null}</p>
            <p style={{ color: "red" }}>{formError}</p>
            {isFormOpen && (
                <CustomerDebtForm
                    debt={selectedDebt}
                    onSubmit={handleSubmit}
                    onCancel={() => { onCancelClick() }}
                />
            )}
        </div>
    );
}
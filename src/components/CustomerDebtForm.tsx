import { useEffect, useState } from "react";
import type { CustomerDebt, CustomerDebtFormValues } from "../types/CustomerDebt";
import { formatDateForInput } from "../utils/date";

const emptyForm: CustomerDebtFormValues = {
    date: "",
    customerName: "",
    amount: 0,
    relatedTripId: undefined,
    notes: "",
};

type DebtFormProps = {
    debt: CustomerDebt | null; // if null, form is for new debt. If not null, form is for editing existing debt
    onSubmit: (values: CustomerDebtFormValues) => void; // parent callback when form is submitted
    onCancel: () => void; // parent callback when form is cancelled
};

function mapDebtToFormValues(debt: CustomerDebt | null): CustomerDebtFormValues {
    return { // Map explicitly converts debt.relatedTripId null to 0 for form input, since HTML number input can't handle null
        date: debt ? debt.date : "",
        customerName: debt ? debt.customerName : "",
        amount: debt ? debt.amount : 0,
        relatedTripId: debt && debt.relatedTripId ? debt.relatedTripId : undefined,
        notes: debt ? debt.notes : "",
    }
}

export default function CustomerDebtForm({
    debt,
    onSubmit, // callback to parent with form values when user submits
    onCancel, // callback to parent when user cancels the form 
}: DebtFormProps) {
    const [form, setForm] = useState<CustomerDebtFormValues>(emptyForm); // only works on first load, if debt changes later it won't update form state

    useEffect(() => {
        if(debt) {
            setForm(mapDebtToFormValues(debt));
        } else {
            setForm(emptyForm);
        }
    }, [debt]); // whenever debt prop changes, update form state with new debt values (or empty if null)



    function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value === "" ? 0 : Number(value),
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("customer debt form values:", form);
        onSubmit(form);
    }

    return (
        <div>
            <h2>{debt ? "Edit Customer Debt" : "New Customer Debt"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formatDateForInput(form.date)}
                        onChange={handleTextChange}
                    />
                </div>

                <div>
                    <label>Customer Name</label>
                    <input
                        type="text"
                        name="customerName"
                        value={form.customerName}
                        onChange={handleTextChange}
                    />
                </div>

                <div>
                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleNumberChange}
                    />
                </div>

                <div>
                    <label>Related Trip ID</label>
                    <input
                        type="number"
                        name="relatedTripId"
                        value={form.relatedTripId ?? ""} // if relatedTripId is undefined, set input value to empty string so it becomes blank in the form
                        onChange={handleNumberChange}
                    />
                </div>

                <div>
                    <label>Notes</label>
                    <input
                        type="text"
                        name="notes"
                        value={form.notes}
                        onChange={handleTextChange}
                    />
                </div>

                <div style={{ marginTop: 12 }}>
                    <button type="submit">Save</button>
                </div>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        </div>
    );
}
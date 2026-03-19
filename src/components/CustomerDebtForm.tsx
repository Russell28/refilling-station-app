import { useState } from "react";

type CustomerDebtFormValues = {
    date: string;
    customerName: string;
    amount: number;
    relatedTripId: number;
    notes: string;
};

const emptyForm: CustomerDebtFormValues = {
    date: "",
    customerName: "",
    amount: 0,
    relatedTripId: 0,
    notes: "",
};

type DebtFormProps = {
    onSubmit: (values: CustomerDebtFormValues) => void; // parent callback when form is submitted
    onCancel: () => void; // parent callback when form is cancelled
};

export default function CustomerDebtForm({
    onSubmit, // callback to parent with form values when user submits
    onCancel, // callback to parent when user cancels the form 
}: DebtFormProps) {
    const [form, setForm] = useState<CustomerDebtFormValues>(emptyForm);

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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Date</label>
                <input
                    type="date"
                    name="date"
                    value={form.date}
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
                    value={form.relatedTripId}
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
    );
}
import { useEffect, useState } from "react";
import { type CreateUpdateCustomerDebtRequest, type CustomerDebt, type CustomerDebtFormValues, emptyForm } from "./CustomerDebt";
import { formatDateForInput } from "../../utils/date";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import { CUSTOMERS } from "../constants/constants";
import Dropdown from "../../components/ui/Dropdown";

type DebtFormProps = {
    debt: CustomerDebt | null;
    onSubmit: (values: CreateUpdateCustomerDebtRequest) => void;
    onCancel: () => void;
};

function mapDebtToFormValues(debt: CustomerDebt | null): CustomerDebtFormValues {
    return {
        date: debt ? debt.date : "",
        customerName: debt ? debt.customerName : "",
        amount: debt ? debt.amount.toString() : "",
        relatedTripId: debt ? debt.relatedTripId?.toString() : undefined,
        notes: debt ? debt.notes : "",
    };
}

export default function CustomerDebtForm({
    debt,
    onSubmit,
    onCancel,
}: DebtFormProps) {
    const [form, setForm] = useState<CustomerDebtFormValues>(emptyForm);

    useEffect(() => {
        if(debt) {
            setForm(mapDebtToFormValues(debt));
        } else {
            setForm(emptyForm);
        }
    }, [debt]);

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
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
            [name]:
                name === "relatedTripId"
                    ? value === ""
                        ? undefined
                        : Number(value)
                    : value === ""
                        ? 0
                        : Number(value),
        }));
    }

    function mapValuesToCreate(values: CustomerDebtFormValues): CreateUpdateCustomerDebtRequest {
        return {
            date: values.date,
            customerName: values.customerName,
            amount: Number(values.amount) || 0,
            relatedTripId: values.relatedTripId ? Number(values.relatedTripId) : undefined,
            notes: values.notes
        };
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(mapValuesToCreate(form));
    }

    return (
        <Card className="border-slate-300">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    {debt ? "Edit Customer Debt" : "New Customer Debt"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Fill in the customer debt details below.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextInput
                        label="Date"
                        type="date"
                        name="date"
                        value={formatDateForInput(form.date)}
                        onChange={handleTextChange}
                    />

                    <Dropdown
                        label="Customer Name"
                        name="customerName"
                        options={CUSTOMERS}
                        value={form.customerName}
                        onChange={handleTextChange}
                    />
                    {/* <TextInput
                        label="Customer Name"
                        type="text"
                        name="customerName"
                        value={form.customerName}
                        onChange={handleTextChange}
                        placeholder="Enter customer name"
                    /> */}

                    <TextInput
                        label="Amount"
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleTextChange}
                        // placeholder="0"
                    />

                    {/* <TextInput
                        label="Related Trip ID"
                        type="number"
                        name="relatedTripId"
                        value={form.relatedTripId ?? ""}
                        onChange={handleNumberChange}
                        placeholder="Optional"
                    /> */}
                </div>

                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                        Notes
                    </span>
                    <input
                        type="text"
                        name="notes"
                        value={form.notes}
                        onChange={handleTextChange}
                        placeholder="Optional notes"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900"
                    />
                </label>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </Card>
    );
}
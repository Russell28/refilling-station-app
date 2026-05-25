import { useEffect, useState } from "react";
import { type CreateUpdateCustomerDebtRequest, type CustomerDebt, type CustomerDebtFormValues, emptyForm } from "./CustomerDebt";
import { formatDateForInput } from "../../utils/date";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import Dropdown from "../../components/ui/Dropdown";
import { useCustomers } from "../customers/CustomerContext";
import { useFormErrors } from "../../hooks/useFormErrors";
import { createCustomerDebt, updateCustomerDebt } from "./customerDebtsApi";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";

type DebtFormProps = {
    debt: CustomerDebt | null;
    onSuccess: () => void;
    onCancel: () => void;
};

export default function CustomerDebtForm({
    debt,
    onSuccess,
    onCancel,
}: DebtFormProps) {
    const [form, setForm] = useState<CustomerDebtFormValues>(emptyForm);
    const customers = useCustomers();
    const [saving, setSaving] = useState(false);
    const { fieldErrors, generalErrors, applyErrors, clearErrors, setFieldErrors } = useFormErrors<CustomerDebtFormValues>()

    useEffect(() => {
        if (debt) {
            setForm(mapDebtToFormValues(debt));
        } else {
            // Set default to first customer if available
            setForm({
                ...emptyForm,
                customerId: customers.length > 0 ? customers[0].id.toString() : ""
            });
        }
    }, [debt]);

    function mapDebtToFormValues(debt: CustomerDebt | null): CustomerDebtFormValues {
        return {
            date: debt ? debt.date : "",
            customerId: debt ? debt.customerId.toString() : "",
            amount: debt ? debt.amount.toString() : "",
            relatedTripId: debt ? debt.relatedTripId?.toString() : undefined,
            notes: debt ? debt.notes : "",
        };
    }

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function validate(values: CustomerDebtFormValues) {
        const errors: Partial<Record<keyof CustomerDebtFormValues, string[]>> = {}

        if (!values.date) {
            errors.date = ["Date is required"]
        }

        if (!values.customerId) {
            errors.customerId = ["Customer is required"]
        }

        if (!values.amount || isNaN(Number(values.amount)) || Number(values.amount) == 0) {
            errors.amount = ["Amount must be a valid number and cannot be zero"]
        }

        return errors
    }

    function mapValuesToCreate(values: CustomerDebtFormValues): CreateUpdateCustomerDebtRequest {
        return {
            date: values.date,
            customerId: Number(values.customerId),
            amount: Number(values.amount) || 0,
            relatedTripId: values.relatedTripId ? Number(values.relatedTripId) : undefined,
            notes: values.notes
        };
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await saveDebt();
    }

    async function saveDebt() {
        clearErrors();

        const clientErrors = validate(form)

        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors)
            return
        }

        var payload = mapValuesToCreate(form);

        try {
            setSaving(true);
            if (debt) {
                await updateCustomerDebt(debt.id, payload);
            } else {
                await createCustomerDebt(payload);
            }

            onSuccess(); // Notify parent to refresh list or show success message
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            {saving && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span className="text-white text-sm font-medium">Saving…</span>
                    </div>
                </div>
            )}

            {generalErrors.length > 0 && <ServerErrorAlert errors={generalErrors} />}

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
                            error={fieldErrors.date?.[0]}
                        />

                        <Dropdown
                            label="Customer Name"
                            name="customerId"
                            options={customers}
                            value={form.customerId}
                            valueField="id"
                            onChange={handleTextChange}
                            error={fieldErrors.customerId?.[0]}
                        />

                        <TextInput
                            label="Amount"
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleTextChange}
                            error={fieldErrors.amount?.[0]}
                        />
                    </div>

                    <label className="block">
                        <TextInput
                            label="Notes"
                            type="text"
                            name="notes"
                            value={form.notes}
                            onChange={handleTextChange}
                            error={fieldErrors.notes?.[0]}
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
        </div>
    );
}
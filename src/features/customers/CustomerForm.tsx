import { useEffect, useState } from "react";
import { type CreateUpdateCustomerRequest, type Customer, type CustomerFormValues, emptyForm } from "./Customer";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import { createCustomer, updateCustomer } from "./customerApi";


type CustomerFormProps = {
    customer: Customer | null;
    onSuccess: () => void;
    onCancel: () => void;
};

function mapCustomerToFormValues(customer: Customer | null): CustomerFormValues {
    return {
        name: customer ? customer.name : "",
    };
}

export default function CustomerForm({
    customer,
    onSuccess,
    onCancel,
}: CustomerFormProps) {
    const [form, setForm] = useState<CustomerFormValues>(emptyForm);
    const { fieldErrors, generalErrors, applyErrors, clearErrors, setFieldErrors } = useFormErrors<CustomerFormValues>();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (customer) {
            setForm(mapCustomerToFormValues(customer));
        } else {
            setForm(emptyForm);
        }
    }, [customer]);

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function mapValuesToCreate(values: CustomerFormValues): CreateUpdateCustomerRequest {
        return {
            name: values.name,
        };
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await saveCustomer();
    }

    async function saveCustomer() {
        clearErrors();

        const clientErrors = validate(form);

        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors);
            return;
        }

        try {
            setSaving(true);
            const payload = mapValuesToCreate(form);

            if (customer) {
                await updateCustomer(customer.id, payload);
            } else {
                await createCustomer(payload);
            }

            onSuccess();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setSaving(false);
        }
    }

    function validate(values: CustomerFormValues): Partial<Record<keyof CustomerFormValues, string[]>> {
        const errors: Partial<Record<keyof CustomerFormValues, string[]>> = {}

        if (!values.name) {
            errors.name = ["Name is required"]
        }

        return errors
    }

    return (
        <div>
            <Card className="border-slate-300">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {customer ? "Edit Customer" : "New Customer"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Fill in the customer details below.
                    </p>
                </div>

                {saving && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span className="text-white text-sm font-medium">Saving…</span>
                        </div>
                    </div>
                )}

                {generalErrors.length > 0 && <ServerErrorAlert errors={generalErrors} />}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextInput
                        label="Name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleTextChange}
                        placeholder="Enter customer name"
                        error={fieldErrors.name?.[0]}

                    />

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

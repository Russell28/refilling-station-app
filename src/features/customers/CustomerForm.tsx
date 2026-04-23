import { useEffect, useState } from "react";
import { type CreateUpdateCustomerRequest, type Customer, type CustomerFormValues, emptyForm } from "./Customer";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";

type CustomerFormProps = {
    customer: Customer | null;
    onSubmit: (values: CreateUpdateCustomerRequest) => void;
    onCancel: () => void;
};

function mapCustomerToFormValues(customer: Customer | null): CustomerFormValues {
    return {
        name: customer ? customer.name : "",
    };
}

export default function CustomerForm({
    customer,
    onSubmit,
    onCancel,
}: CustomerFormProps) {
    const [form, setForm] = useState<CustomerFormValues>(emptyForm);

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

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(mapValuesToCreate(form));
    }

    return (
        <Card className="border-slate-300">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    {customer ? "Edit Customer" : "New Customer"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Fill in the customer details below.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleTextChange}
                    placeholder="Enter customer name"
                    required
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
    );
}

import { useEffect, useState } from "react";
import type { CreateUpdateCustomerRequest, Customer } from "./Customer";
import { createCustomer, deleteCustomer, getAllCustomers, updateCustomer } from "./customerApi";
import CustomerForm from "./CustomerForm";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setLoading(true);
                const customersData = await getAllCustomers();
                setCustomers(customersData);
            } catch (err) {
                setError("Failed to load customers.");
            } finally {
                setLoading(false);
            }
        }
        loadCustomers();
    }, []);

    function onAddClick() {
        setSelectedCustomer(null);
        setIsFormOpen(true);
    }

    function onEditClick(customer: Customer) {
        setSelectedCustomer(customer);
        setIsFormOpen(true);
    }

    function onCancelClick() {
        setSelectedCustomer(null);
        setIsFormOpen(false);
    }

    async function handleSubmit(formValues: CreateUpdateCustomerRequest) {
        try {
            setSaving(true);
            if (selectedCustomer) {
                await updateCustomer(selectedCustomer.id, formValues);
            } else {
                await createCustomer(formValues);
            }

            // refresh list after save
            const customersData = await getAllCustomers();
            setCustomers(customersData);
            setIsFormOpen(false);
            setSelectedCustomer(null);
            setFormError(null);
        } catch (err) {
            setFormError("Failed to save customer.");
        } finally {
            setSaving(false);
        }
    }

    async function onDeleteClick(id: number) {
        const confirmed = window.confirm("Are you sure you want to delete this customer?");
        if (!confirmed) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await deleteCustomer(id);

            // refresh list after delete
            const customersData = await getAllCustomers();
            setCustomers(customersData);
        } catch (err) {
            setError("Failed to delete customer.");
        } finally {
            setLoading(false);
        }
    }

    if (loading && customers.length === 0) {
        return <p>Loading customers...</p>;
    }
    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div className="space-y-4">
            <PageHeader
                title="Customers"
                description="Manage your customers and their information."
                action={
                    <Button onClick={onAddClick}>
                        New Customer
                    </Button>
                }
            />

            {formError && (
                <Card className="border-red-200 bg-red-50">
                    <p className="text-sm text-red-700">{formError}</p>
                </Card>
            )}

            {saving && (
                <Card>
                    <p className="text-sm text-slate-500">Saving...</p>
                </Card>
            )}

            {isFormOpen && (
                <CustomerForm
                    customer={selectedCustomer}
                    onSubmit={handleSubmit}
                    onCancel={onCancelClick}
                />
            )}

            <Card className="p-0">
                {customers.length === 0 ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">
                            No customers yet.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-left text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">ID</th>
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="border-t border-slate-200"
                                        >
                                            <td className="px-4 py-3">
                                                {customer.id}
                                            </td>
                                            <td className="px-4 py-3">
                                                {customer.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => onEditClick(customer)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() =>
                                                            onDeleteClick(customer.id)
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-3 p-4 md:hidden">
                            {customers.map((customer) => (
                                <div
                                    key={customer.id}
                                    className="rounded-xl border border-slate-200 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {customer.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                ID: {customer.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() => onEditClick(customer)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                onDeleteClick(customer.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}

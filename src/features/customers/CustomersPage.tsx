import { useEffect, useState } from "react";
import type { Customer } from "./Customer";
import { deleteCustomer, getAllCustomers } from "./customerApi";
import CustomerForm from "./CustomerForm";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const { generalErrors, applyErrors, clearErrors } = useFormErrors<Customer>()

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        try {
            clearErrors();
            setLoading(true);
            const customersData = await getAllCustomers();
            setCustomers(customersData);
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

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

    function onSuccess() {
        loadCustomers();
        setIsFormOpen(false);
    }

    async function onDeleteClick(id: number) {
        const confirmed = window.confirm("Are you sure you want to delete this customer?");
        if (!confirmed) {
            return;
        }
        try {
            clearErrors();
            setLoading(true);
            await deleteCustomer(id);

            // refresh list after delete
            await loadCustomers();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <PageHeader
                title="Customers"
                description="Manage customers."
                action={
                    <Button onClick={onAddClick}>
                        Add
                    </Button>
                }
            />

            {isFormOpen && (
                <CustomerForm
                    customer={selectedCustomer}
                    onSuccess={onSuccess}
                    onCancel={onCancelClick}
                />
            )}

            {generalErrors.length > 0 && (
                <ServerErrorAlert errors={generalErrors} />
            )}

            <Card className="p-0">
                {loading ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">Loading customers...</p>
                    </div>
                ) : customers.length === 0 ? (
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

                        <div className="space-y-3 p-1 md:hidden">
                            {customers.map((customer) => (
                                <div
                                    key={customer.id}
                                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <p className="font-semibold text-slate-900 truncate">
                                            {customer.name}
                                        </p>
                                    </div>

                                    {/* Footer actions */}
                                    <div className="flex justify-end gap-2 border-t border-slate-100 px-3 py-2">
                                        <Button
                                            variant="primary"
                                            className="flex items-center gap-1 rounded-md px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={() => onEditClick(customer)}
                                        >
                                            <FaEdit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="flex items-center gap-1 rounded-md px-3 py-2 text-sm bg-red-600 text-white hover:bg-red-700"
                                            onClick={() => onDeleteClick(customer.id)}
                                        >
                                            <FaTrash className="w-3 h-3" />
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

import { useEffect, useRef, useState } from "react";
import type { CustomerDebt, CustomerDebtFormValues } from "./CustomerDebt";
import { deleteCustomerDebt, getCustomerDebts, searchCustomerDebts } from "./customerDebtsApi";
import CustomerDebtForm from "./CustomerDebtForm";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { apiClient } from "../../api/client";
import { getToken, isAdmin } from "../auth/utils/authStorage";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import { getFirstDayOfCurrentMonth, getTodayDateOnly } from "../../utils/date";
import type { DateRangeSearchRequest } from "../../types/DateRangeRequest";
import TextInput from "../../components/ui/TextInput";
import { FaEdit, FaTrash } from "react-icons/fa";


export default function CustomerDebtPage() {
    const [customerDebts, setCustomerDebts] = useState<CustomerDebt[]>([]);
    const [loading, setLoading] = useState(false);
    const { applyErrors, clearErrors, generalErrors } = useFormErrors<CustomerDebtFormValues>()
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<CustomerDebt | null>(null);
    const [searchRequest, setSearchRequest] = useState<DateRangeSearchRequest>({
        startDate: getFirstDayOfCurrentMonth(),
        endDate: getTodayDateOnly(),
    });

    useEffect(() => {
        loadDebts();
    }, [searchRequest]);

    async function loadDebts() {
        try {
            clearErrors();
            setLoading(true);
            const debts = await searchCustomerDebts(searchRequest);
            setCustomerDebts(debts);
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    function onAddClick() {
        setSelectedDebt(null); // clear any selected debt when adding new
        setIsFormOpen(true);
    }

    function onEditClick(debt: CustomerDebt) {
        setSelectedDebt(debt);
        setIsFormOpen(true);
    }

    function onCancelClick() {
        setSelectedDebt(null);
        setIsFormOpen(false);
    }

    function onSuccessSave() {
        loadDebts();
        setIsFormOpen(false);
        setSelectedDebt(null);
    }

    async function onDeleteClick(id: number) {
        const confirmed = window.confirm("Are you sure you want to delete this customer debt?");
        if (!confirmed) {
            return;
        }
        try {
            clearErrors();
            setLoading(true);
            await deleteCustomerDebt(id);

            // refresh list after delete
            loadDebts();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(
                `${apiClient.defaults.baseURL}/customer-debts/import`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            const data = await res.json();

            const debts = await getCustomerDebts();
            setCustomerDebts(debts);
            alert(`Imported ${data.insertedRows} rows`);
        } catch (err) {
            console.error(err);
            alert("Import failed");
        }
    };

    return (
        <div className="space-y-4">
            <PageHeader
                title="Debt Entries"
                description="Track unpaid balances and customer debt records."
                action={
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">

                        {/* Top row: actions */}
                        <div className="flex gap-2">
                            {isAdmin() && (
                                <Button
                                    variant="secondary"
                                    onClick={handleImportClick}
                                >
                                    Import
                                </Button>
                            )}
                            <Button onClick={onAddClick}>
                                Add
                            </Button>
                        </div>
                    </div>

                }
            />

            {isAdmin() && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <TextInput
                        label="Start Date"
                        type="date"
                        value={searchRequest.startDate}
                        onChange={(e) =>
                            setSearchRequest({ ...searchRequest, startDate: e.target.value })
                        }
                    />
                    <TextInput
                        label="End Date"
                        type="date"
                        value={searchRequest.endDate}
                        onChange={(e) =>
                            setSearchRequest({ ...searchRequest, endDate: e.target.value })
                        }
                    />
                    {/* <Button onClick={loadDebts}>Apply</Button> */}
                </div>
            )}

            {/* hidden input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Customer Debt Form */}
            {isFormOpen && (
                <CustomerDebtForm
                    debt={selectedDebt}
                    onSuccess={onSuccessSave}
                    onCancel={onCancelClick}
                />
            )}

            {generalErrors.length > 0 && (
                <ServerErrorAlert errors={generalErrors} />
            )}

            <Card className="p-0">
                {loading ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">
                            Loading customer debts...
                        </p>
                    </div>
                ) : customerDebts.length === 0 ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">
                            No customer debt entries yet.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-left text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Date</th>
                                        <th className="px-4 py-3 font-medium">Customer</th>
                                        <th className="px-4 py-3 font-medium">Amount</th>
                                        <th className="px-4 py-3 font-medium">Notes</th>
                                        <th className="px-4 py-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerDebts.map((debt) => (
                                        <tr
                                            key={debt.id}
                                            className="border-t border-slate-200"
                                        >
                                            <td className="px-4 py-3">
                                                {new Date(debt.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {debt.customerName}
                                            </td>
                                            <td className="px-4 py-3">
                                                ₱{debt.amount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {debt.notes || "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => onEditClick(debt)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() =>
                                                            onDeleteClick(debt.id)
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
                            {customerDebts.map((debt) => (
                                <div
                                    key={debt.id}
                                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <div>
                                            <p className="font-semibold text-slate-900 truncate">
                                                {debt.customerName}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(debt.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="text-base font-bold text-slate-900">
                                            ₱{debt.amount.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Notes only if present */}
                                    {debt.notes && (
                                        <div className="px-4 pb-3 text-sm">
                                            <span className="block text-xs text-slate-500">Notes</span>
                                            <span className="font-medium text-slate-700">{debt.notes}</span>
                                        </div>
                                    )}

                                    {/* Footer actions */}
                                    <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-3">
                                        <Button
                                            variant="primary"
                                            className="rounded-md p-2 bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={() => onEditClick(debt)}
                                        >
                                            <FaEdit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="rounded-md p-2 bg-red-600 text-white hover:bg-red-700"
                                            onClick={() => onDeleteClick(debt.id)}
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
import { useState, useEffect, useRef } from "react";
import type { Payroll, PayrollFormValues } from "./Payroll";
import { deletePayroll, getPayrolls } from "./payrollApi";
import { formatDateForInput } from "../../utils/date";
import PayrollEntryForm from "./PayrollEntryForm";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { apiClient } from "../../api/client";
import { getToken } from "../auth/utils/authStorage";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";

export default function PayrollsPage() {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
    const { generalErrors, applyErrors, clearErrors } = useFormErrors<PayrollFormValues>()


    useEffect(() => {
        loadPayrolls();
    }, []);

    async function loadPayrolls() {
        clearErrors();

        try {
            setLoading(true);
            const payrolls = await getPayrolls();
            setPayrolls(payrolls);
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    function onAddClick() {
        setSelectedPayroll(null); // clear any selected payroll when adding new
        setIsFormOpen(true);
    }

    function onEditClick(payroll: Payroll) {
        setSelectedPayroll(payroll);
        setIsFormOpen(true);
    }

    function handleCancel() {
        setSelectedPayroll(null);
        setIsFormOpen(false);
    }

    function onSuccess() {
        loadPayrolls();
        setIsFormOpen(false);
        setSelectedPayroll(null);
    }

    async function onDeleteClick(payrollId: number) {
        const confirmed = window.confirm("Are you sure you want to delete this payroll entry?");
        if (!confirmed) {
            return;
        }

        clearErrors();
        try {
            setLoading(true);
            await deletePayroll(payrollId);
            // refresh list after delete
            await loadPayrolls();
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
                `${apiClient.defaults.baseURL}/payrolls/import`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            const data = await res.json();

            const payrolls = await getPayrolls();
            setPayrolls(payrolls);
            alert(`Imported ${data.insertedRows} rows`);
        } catch (err) {
            console.error(err);
            alert("Import failed");
        }
    };

    return (
        <div className="space-y-4">
            <PageHeader
                title="Payroll"
                description="Track employee salary, advances, and cash paid."
                action={
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={handleImportClick}
                        >
                            Import CSV
                        </Button>

                        <Button onClick={onAddClick}>
                            New Payroll Entry
                        </Button>
                    </div>
                }
            />

            {/* hidden input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
            />

            {generalErrors.length > 0 && (
                <ServerErrorAlert errors={generalErrors} />
            )}

            {isFormOpen && (
                <PayrollEntryForm
                    selectedPayroll={selectedPayroll}
                    onSuccess={onSuccess}
                    onCancel={handleCancel}
                />
            )}

            <Card className="p-0">
                {loading ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">Loading payroll entries...</p>
                    </div>
                ) : payrolls.length === 0 ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">No payroll entries yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-left text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Earned Date</th>
                                        <th className="px-4 py-3 font-medium">Employee</th>
                                        <th className="px-4 py-3 font-medium">Salary</th>
                                        <th className="px-4 py-3 font-medium">Cash Paid</th>
                                        <th className="px-4 py-3 font-medium">Paid Date</th>
                                        <th className="px-4 py-3 font-medium">Notes</th>
                                        <th className="px-4 py-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payrolls.map((payroll) => (
                                        <tr
                                            key={payroll.id}
                                            className="border-t border-slate-200"
                                        >
                                            <td className="px-4 py-3">
                                                {formatDateForInput(payroll.earnedDate)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {payroll.employeeName}
                                            </td>
                                            <td className="px-4 py-3">
                                                ₱{payroll.salaryAmount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                ₱{payroll.cashPaid.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatDateForInput(payroll.paidDate)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {payroll.notes || "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => onEditClick(payroll)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => onDeleteClick(payroll.id)}
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
                            {payrolls.map((payroll) => (
                                <div
                                    key={payroll.id}
                                    className="rounded-xl border border-slate-200 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {payroll.employeeName}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {formatDateForInput(payroll.earnedDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                ₱{payroll.cashPaid.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {formatDateForInput(payroll.paidDate)}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="mt-3 grid grid-cols-1 gap-1 text-sm text-slate-600">
                                        <p>
                                            <span className="font-medium text-slate-700">Salary:</span>{" "}
                                            ₱{payroll.salaryAmount.toLocaleString()}
                                        </p>
                                        <p>
                                            <span className="font-medium text-slate-700">Notes:</span>{" "}
                                            {payroll.notes || "-"}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={() => onEditClick(payroll)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="flex-1"
                                            onClick={() => onDeleteClick(payroll.id)}
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
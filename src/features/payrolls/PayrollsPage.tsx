import { useState, useEffect, useRef } from "react";
import type { CreateUpdatePayrollRequest, Payroll } from "./Payroll";
import { createPayroll, deletePayroll, getPayrolls, updatePayroll } from "./payrollApi";
import { formatDateForInput } from "../../utils/date";
import PayrollEntryForm from "./PayrollEntryForm";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { apiClient } from "../../api/client";
import { getToken } from "../auth/utils/authStorage";

export default function PayrollsPage() {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        const loadPayrolls = async () => {
            try {
                setLoading(true);
                setError(null);
                const payrolls = await getPayrolls();
                setPayrolls(payrolls);
            } catch (err) {
                console.error("Error loading payrolls:", err);
                setError("Failed to load payrolls.");
            } finally {
                setLoading(false);
            }
        };
        loadPayrolls();
    }, []);

    function onAddClick() {
        setSelectedPayroll(null); // clear any selected payroll when adding new
        setIsFormOpen(true);
    }

    function onEditClick(payroll: Payroll) {
        setSelectedPayroll(payroll);
        console.log("Edit payroll:", selectedPayroll);
        setIsFormOpen(true);
    }

    function handleCancel() {
        setSelectedPayroll(null);
        setIsFormOpen(false);
    }

    async function handleSubmit(formValues: CreateUpdatePayrollRequest) {
        try {
            setSaving(true);
            setFormError(null);
            if (selectedPayroll) {
                await updatePayroll(selectedPayroll.id, formValues);
            } else {
                await createPayroll(formValues);
            }

            // refresh list after save            
            const payrolls = await getPayrolls();
            setPayrolls(payrolls);
            setIsFormOpen(false);
            setSelectedPayroll(null);
        } catch (err) {
            setFormError("Failed to create payroll.");
        } finally {
            setSaving(false);
        }
    }

    async function onDeleteClick(payrollId: number) {
        const confirmed = window.confirm("Are you sure you want to delete this payroll entry?");
        if (!confirmed) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await deletePayroll(payrollId);
            // refresh list after delete
            const payrolls = await getPayrolls();
            setPayrolls(payrolls);
        } catch (err) {
            setError("Failed to delete payroll.");
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
                `${apiClient.defaults.baseURL}/payroll-entries/import`,
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


    if (loading) {
        return <div>Loading payrolls...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <p className="text-sm text-red-700">{error}</p>
                </Card>
            )}

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
                <PayrollEntryForm
                    selectedPayroll={selectedPayroll}
                    onSubmit={handleSubmit}
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
                                        <th className="px-4 py-3 font-medium">Date</th>
                                        <th className="px-4 py-3 font-medium">Employee</th>
                                        <th className="px-4 py-3 font-medium">Salary</th>
                                        <th className="px-4 py-3 font-medium">Advance Given</th>
                                        <th className="px-4 py-3 font-medium">Advance Deduction</th>
                                        <th className="px-4 py-3 font-medium">Cash Paid</th>
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
                                                {formatDateForInput(payroll.date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {payroll.employeeName}
                                            </td>
                                            <td className="px-4 py-3">
                                                ₱{payroll.salaryAmount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                ₱{payroll.advanceGiven.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                ₱{payroll.advanceDeduction.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                ₱{payroll.cashPaid.toLocaleString()}
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
                                                {formatDateForInput(payroll.date)}
                                            </p>
                                        </div>

                                        <p className="font-semibold text-slate-900">
                                            ₱{payroll.cashPaid.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="mt-3 grid grid-cols-1 gap-1 text-sm text-slate-600">
                                        <p>
                                            <span className="font-medium text-slate-700">Salary:</span>{" "}
                                            ₱{payroll.salaryAmount.toLocaleString()}
                                        </p>
                                        <p>
                                            <span className="font-medium text-slate-700">Advance Given:</span>{" "}
                                            ₱{payroll.advanceGiven.toLocaleString()}
                                        </p>
                                        <p>
                                            <span className="font-medium text-slate-700">Advance Deduction:</span>{" "}
                                            ₱{payroll.advanceDeduction.toLocaleString()}
                                        </p>
                                        <p>
                                            <span className="font-medium text-slate-700">Cash Paid:</span>{" "}
                                            ₱{payroll.cashPaid.toLocaleString()}
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
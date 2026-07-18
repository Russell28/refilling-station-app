import { useState, useEffect, useRef } from "react";
import type { Payroll, PayrollFormValues } from "./Payroll";
import { deletePayroll, getPayrolls, searchPayrolls } from "./payrollApi";
import PayrollEntryForm from "./PayrollEntryForm";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { apiClient } from "../../api/client";
import { getToken } from "../auth/utils/authStorage";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import { formatDateForInput, getFirstDayOfCurrentWeek, getTodayDateOnly } from "../../utils/date";
import type { DateRangeSearchRequest } from "../../types/DateRangeRequest";
import TextInput from "../../components/ui/TextInput";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function PayrollsPage() {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
    const { generalErrors, applyErrors, clearErrors } = useFormErrors<PayrollFormValues>();
    const [searchRequest, setSearchRequest] = useState<DateRangeSearchRequest>({
        startDate: getFirstDayOfCurrentWeek(),
        endDate: getTodayDateOnly(),
    });


    useEffect(() => {
        loadPayrolls();
    }, [searchRequest]);

    async function loadPayrolls() {
        clearErrors();

        try {
            setLoading(true);
            const payrolls = await searchPayrolls(searchRequest);
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
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">

                        {/* Top row: actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={handleImportClick}
                            >
                                Import
                            </Button>

                            <Button onClick={onAddClick}>
                                Add
                            </Button>
                        </div>
                    </div>
                }
            />

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
                {/* <Button onClick={loadPayrolls}>Apply</Button> */}
            </div>

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

                        <div className="space-y-3 p-1 md:hidden">
                            {payrolls.map((payroll) => (
                                <div
                                    key={payroll.id}
                                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <div>
                                            <p className="font-semibold text-slate-900 truncate">
                                                {payroll.employeeName}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {formatDateForInput(payroll.earnedDate)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Salary */}
                                    <div className="px-4 pb-3 text-sm">
                                        <span className="block text-xs text-slate-500">Salary</span>
                                        <span className="font-medium text-slate-700">
                                            ₱{payroll.salaryAmount.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Notes only if present */}
                                    {payroll.notes && (
                                        <div className="px-4 pb-3 text-sm">
                                            <span className="block text-xs text-slate-500">Notes</span>
                                            <span className="font-medium text-slate-700">{payroll.notes}</span>
                                        </div>
                                    )}

                                    {/* Footer actions */}
                                    <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-3">
                                        <Button
                                            variant="primary"
                                            className="rounded-md p-2 bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={() => onEditClick(payroll)}
                                        >
                                            <FaEdit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="rounded-md p-2 bg-red-600 text-white hover:bg-red-700"
                                            onClick={() => onDeleteClick(payroll.id)}
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
import { useState, useEffect, useRef } from "react";
import type { Expense, ExpenseFormValues } from "./Expense";
import { deleteExpense, getExpenses } from "./expenseApi";
import { formatDateForInput } from "../../utils/date";
import ExpenseForm from "./ExpenseForm";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { apiClient } from "../../api/client";
import { getToken, isAdmin } from "../auth/utils/authStorage";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const { generalErrors, applyErrors, clearErrors } = useFormErrors<ExpenseFormValues>()
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    useEffect(() => {
        loadExpenses();
    }, []); // [] run once on first load

    async function loadExpenses() {
        clearErrors();

        try {
            setLoading(true);
            const expenses = await getExpenses();
            setExpenses(expenses);
        } catch (err) {
            console.error("Error loading expenses:", err);
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    function onAddClick() {
        setSelectedExpense(null); // clear any selected record when adding new
        setIsFormOpen(true);
    }

    function onEditClick(expense: Expense) {
        setSelectedExpense(expense);
        setIsFormOpen(true);
    }

    function onCancel() {
        setSelectedExpense(null);
        setIsFormOpen(false);
    }

    async function onDeleteClick(id: number) {
        const confirmed = window.confirm("Are you sure you want to delete this expense?");
        if (!confirmed) {
            return;
        }

        clearErrors();

        try {
            setLoading(true);
            await deleteExpense(id);
            // refresh list after delete
            await loadExpenses();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    function onSuccess() {
        setIsFormOpen(false);
        setSelectedExpense(null);
        loadExpenses();
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
                `${apiClient.defaults.baseURL}/expenses/import`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            const data = await res.json();

            await loadExpenses();
            alert(`Imported ${data.insertedRows} rows`);
        } catch (err) {
            console.error(err);
            alert("Import failed");
        }
    };

    return (
        <div className="space-y-4">
            <PageHeader
                title="Expenses"
                description="Track daily and operational expenses."
                action={
                    <div>
                        {isAdmin() && (
                            <Button
                                variant="secondary"
                                onClick={handleImportClick}
                            >
                                Import CSV
                            </Button>
                        )}

                        <Button onClick={onAddClick}>
                            New Expense
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

            {isFormOpen && (
                <ExpenseForm
                    expense={selectedExpense}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                />
            )}

            {generalErrors.length > 0 && (
                <ServerErrorAlert errors={generalErrors} />
            )}

            <Card className="p-0">
                {loading ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">Loading expenses...</p>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">No expenses yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-left text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Date</th>
                                        <th className="px-4 py-3 font-medium">Category</th>
                                        <th className="px-4 py-3 font-medium">Amount</th>
                                        <th className="px-4 py-3 font-medium">Notes</th>
                                        <th className="px-4 py-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((expense) => (
                                        <tr
                                            key={expense.id}
                                            className="border-t border-slate-200"
                                        >
                                            <td className="px-4 py-3">
                                                {formatDateForInput(expense.date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {expense.expenseCategory}
                                            </td>
                                            <td className="px-4 py-3">
                                                ₱{expense.amount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {expense.notes || "-"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => onEditClick(expense)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => onDeleteClick(expense.id)}
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
                            {expenses.map((expense) => (
                                <div
                                    key={expense.id}
                                    className="rounded-xl border border-slate-200 p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {expense.expenseCategory}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {formatDateForInput(expense.date)}
                                            </p>
                                        </div>

                                        <p className="font-semibold text-slate-900">
                                            ₱{expense.amount.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="mt-3 text-sm text-slate-600">
                                        <p>
                                            <span className="font-medium text-slate-700">
                                                Notes:
                                            </span>{" "}
                                            {expense.notes || "-"}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={() => onEditClick(expense)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="flex-1"
                                            onClick={() => onDeleteClick(expense.id)}
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
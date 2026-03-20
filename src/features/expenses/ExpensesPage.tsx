import { useState, useEffect } from "react";
import type { Expense, ExpenseFormValues } from "./Expense";
import { createExpense, deleteExpense, getExpenses, updateExpense } from "./expenseApi";
import { formatDateForInput } from "../../utils/date";
import ExpenseForm from "./ExpenseForm";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<Expense | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                setLoading(true);
                setError(null);
                const expenses = await getExpenses();
                setExpenses(expenses);

            } catch (err) {
                console.error("Error loading expenses:", err);
                setError("Failed to load expenses.");
            } finally {
                setLoading(false);
            }
        };
        loadExpenses();
    }, []); // [] run once on first load

    function onAddClick() {
        setIsFormOpen(true);
        setSelectedRecord(null); // clear any selected record when adding new
    }

    function onEditClick(expense: Expense) {
        setSelectedRecord(expense);
        setIsFormOpen(true);
    }

    function onCancel() {
        setSelectedRecord(null);
        setIsFormOpen(false);
    }

    async function onDeleteClick(id: number) {
        const confirmed = window.confirm("Are you sure you want to delete this expense?");
        if (!confirmed) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await deleteExpense(id);

            // refresh list after delete
            const expenses = await getExpenses();
            setExpenses(expenses);
        } catch (err) {
            setError("Failed to delete expense.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(formValues: ExpenseFormValues) {
        try {
            setSaving(true);
            setError(null);
            if (selectedRecord) {
                await updateExpense(selectedRecord.id, formValues);
            } else {
                await createExpense(formValues);
            }

            // refresh list after create
            const expenses = await getExpenses();
            setExpenses(expenses);
            setIsFormOpen(false);
            setSelectedRecord(null);

        } catch (err) {
            setError("Failed to create expense.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div>Loading expenses...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div>
            <h1>Expenses</h1>
            <button onClick={onAddClick}>New Expense</button>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Notes</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id}>
                            <td>{formatDateForInput(expense.date)}</td>
                            <td>{expense.expenseCategory}</td>
                            <td>{expense.amount.toFixed(2)}</td>
                            <td>{expense.notes}</td>
                            <td>
                                <button onClick={() => onEditClick(expense)}>Edit</button>
                                <button onClick={() => onDeleteClick(expense.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p>{saving ? "Saving..." : null}</p>
            <p style={{ color: "red" }}>{formError}</p>
            {
                isFormOpen &&
                <ExpenseForm
                    expense={selectedRecord}
                    onSubmit={handleSubmit}
                    onCancel={onCancel}
                />
            }
        </div>
    );
}
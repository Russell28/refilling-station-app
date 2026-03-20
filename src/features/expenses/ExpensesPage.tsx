import { useState, useEffect } from "react";
import type { Expense } from "./Expense";
import { getExpenses } from "./expenseApi";
import { formatDateForInput } from "../../utils/date";
import ExpenseForm from "./ExpenseForm";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<Expense | null>(null);

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                setLoading(true);
                setError(null);
                const expenses =await getExpenses();
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
    }

    function onEditClick(expense: Expense) {
        setSelectedRecord(expense);
        setIsFormOpen(true);
        console.log("Edit expense:", expense);
    }

    function onDeleteClick(id: number) {
        console.log("Delete expense with id:", id);
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
                            <td>{expense.category}</td>
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

            { isFormOpen && <ExpenseForm /> }
        </div>
    );
}
import { useState, useEffect } from "react";
import type { Expense } from "./Expense";
import { getExpenses } from "./expenseApi";
import { formatDateForInput } from "../../utils/date";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) {
        return <div>Loading expenses...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div>
            <h1>Expenses</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id}>
                            <td>{formatDateForInput(expense.date)}</td>
                            <td>{expense.category}</td>
                            <td>{expense.amount.toFixed(2)}</td>
                            <td>{expense.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
import { useEffect, useState } from "react";
import { emptyExpenseFormValues, type Expense, type ExpenseFormValues } from "./Expense";
import { formatDateForInput } from "../../utils/date";

type ExpenseFormProps = {
    expense: Expense | null;
    onSubmit: (values: ExpenseFormValues) => void;
    onCancel: () => void;
}

function mapExpenseToFormValues(expense: Expense | null): ExpenseFormValues {
    return {
        date: expense ? expense.date : "",
        expenseCategory: expense ? expense.expenseCategory : "",
        amount: expense ? expense.amount : 0,
        notes: expense ? expense.notes : ""
    };
}


export default function ExpenseForm({
    expense,
    onSubmit,
    onCancel
}: ExpenseFormProps) {
    const [expenseFormValues, setExpenseFormValues] = useState<ExpenseFormValues>(emptyExpenseFormValues);

    useEffect(() => {
        if (expense) {
            setExpenseFormValues(mapExpenseToFormValues(expense));
        } else {
            setExpenseFormValues(emptyExpenseFormValues);
        }

    }, [expense]);

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setExpenseFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setExpenseFormValues((prev) => ({
            ...prev,
            [name]: value === "" ? 0 : Number(value),
        }));
    }

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        onSubmit(expenseFormValues);
    }

    return (
        <div>
            <h2>{expense ? "Edit Expense" : "New Expense"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date</label>
                    <input 
                        type="date" 
                        name="date" 
                        value={formatDateForInput(expenseFormValues.date)} 
                        onChange={handleTextChange} />
                </div>
                <div>
                    <label>Category</label>
                    <input 
                        type="text" 
                        name="expenseCategory" 
                        value={expenseFormValues.expenseCategory} 
                        onChange={handleTextChange} />
                </div>
                <div>
                    <label>Amount</label>
                    <input 
                        type="number" 
                        name="amount" 
                        step="1" 
                        value={expenseFormValues.amount} 
                        onChange={handleNumberChange} />
                </div>
                <div>
                    <label>Notes</label>
                    <input 
                        type="text" 
                        name="notes" 
                        value={expenseFormValues.notes} 
                        onChange={handleTextChange} />
                </div>
                <div style={{ marginTop: 12 }}>
                    <button type="submit">Save</button>
                </div>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>

        </div>
    );
}
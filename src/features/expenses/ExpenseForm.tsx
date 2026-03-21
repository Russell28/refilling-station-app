import { useEffect, useState } from "react";
import { emptyExpenseFormValues, type Expense, type ExpenseFormValues } from "./Expense";
import { formatDateForInput } from "../../utils/date";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";

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
        <Card className="border-slate-300">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    {expense ? "Edit Expense" : "New Expense"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Fill in the expense details below.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextInput
                        label="Date"
                        type="date"
                        name="date"
                        value={formatDateForInput(expenseFormValues.date)}
                        onChange={handleTextChange}
                    />

                    <TextInput
                        label="Category"
                        type="text"
                        name="expenseCategory"
                        value={expenseFormValues.expenseCategory}
                        onChange={handleTextChange}
                        placeholder="Enter expense category"
                    />

                    <TextInput
                        label="Amount"
                        type="number"
                        name="amount"
                        step="1"
                        value={expenseFormValues.amount}
                        onChange={handleNumberChange}
                        placeholder="0"
                    />
                </div>

                <label className="block">
                    <span className="mb-1 block text-sm font-medium text-slate-700">
                        Notes
                    </span>
                    <input
                        type="text"
                        name="notes"
                        value={expenseFormValues.notes}
                        onChange={handleTextChange}
                        placeholder="Optional notes"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900"
                    />
                </label>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Card>
    );
}
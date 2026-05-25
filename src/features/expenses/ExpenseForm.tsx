import { useEffect, useState } from "react";
import { emptyExpenseFormValues, type CreateUpdateExpenseRequest, type Expense, type ExpenseFormValues } from "./Expense";
import { formatDateForInput } from "../../utils/date";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import Dropdown from "../../components/ui/Dropdown";
import { useExpenseCategories } from "../expense-category/ExpenseCategoryContext";
import { useFormErrors } from "../../hooks/useFormErrors";
import { createExpense } from "./expenseApi";
import { updateExpense } from "./expenseApi";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";

type ExpenseFormProps = {
    expense: Expense | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ExpenseForm({
    expense,
    onSuccess,
    onCancel
}: ExpenseFormProps) {
    const [expenseFormValues, setExpenseFormValues] = useState<ExpenseFormValues>(emptyExpenseFormValues);
    const expenseCategories = useExpenseCategories();
    const [saving, setSaving] = useState(false);
    const { fieldErrors, generalErrors, applyErrors, clearErrors, setFieldErrors } = useFormErrors<ExpenseFormValues>()

    useEffect(() => {
        if (expense) {
            setExpenseFormValues(mapExpenseToFormValues(expense));
        } else {
            setExpenseFormValues({
                ...emptyExpenseFormValues,
                expenseCategoryId: expenseCategories.length > 0 ? expenseCategories[0].id.toString() : '',
            });
        }

    }, [expense]);

    function mapExpenseToFormValues(expense: Expense | null): ExpenseFormValues {
        return {
            date: expense ? expense.date : "",
            expenseCategoryId: expense ? expense.expenseCategoryId.toString() : "",
            amount: expense ? expense.amount.toString() : "",
            notes: expense ? expense.notes : ""
        };
    }

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setExpenseFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function mapValuesToCreate(values: ExpenseFormValues): CreateUpdateExpenseRequest {
        return {
            date: values.date,
            expenseCategoryId: Number(values.expenseCategoryId),
            amount: Number(values.amount) || 0,
            notes: values.notes
        };
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        await saveExpense();
    }

    async function saveExpense() {
        clearErrors();

        const clientErrors = validate(expenseFormValues);

        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors);
            return;
        }

        var payload = mapValuesToCreate(expenseFormValues);

        try {
            setSaving(true);
            if (expense) {
                await updateExpense(expense.id, payload);
            } else {
                await createExpense(payload);
            }

            onSuccess();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setSaving(false);
        }
    }

    function validate(values: ExpenseFormValues) {
        const errors: Partial<Record<keyof ExpenseFormValues, string[]>> = {}

        if (!values.date) {
            errors.date = ["Date is required"]
        }

        if (!values.expenseCategoryId) {
            errors.expenseCategoryId = ["Category is required"]
        }

        if (!values.amount || isNaN(Number(values.amount)) || Number(values.amount) <= 0) {
            errors.amount = ["Amount must be a valid number and greater than zero"]
        }

        return errors
    }


    return (
        <div>
            {saving && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span className="text-white text-sm font-medium">Saving…</span>
                    </div>
                </div>
            )}

            {generalErrors.length > 0 && <ServerErrorAlert errors={generalErrors} />}

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
                            error={fieldErrors.date?.[0]}
                        />

                        <Dropdown
                            label="Category"
                            name="expenseCategoryId"
                            options={expenseCategories}
                            value={expenseFormValues.expenseCategoryId}
                            valueField="id"
                            onChange={handleTextChange}
                            error={fieldErrors.expenseCategoryId?.[0]}
                        />

                        <TextInput
                            label="Amount"
                            type="number"
                            name="amount"
                            step="1"
                            value={expenseFormValues.amount}
                            onChange={handleTextChange}
                            error={fieldErrors.amount?.[0]}
                        />
                    </div>

                    <label className="block">
                        <TextInput
                            label="Notes"
                            type="text"
                            name="notes"
                            value={expenseFormValues.notes}
                            onChange={handleTextChange}
                            error={fieldErrors.notes?.[0]}
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
        </div>

    );
}
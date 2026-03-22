import { useState, useEffect } from "react";
import { type Payroll, type PayrollFormValues, emptyPayrollFormValues } from "./Payroll";
import { formatDateForInput } from "../../utils/date";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";

type PayrollEntryFormProps = {
    selectedPayroll: Payroll | null;
    onSubmit: (formValues: PayrollFormValues) => Promise<void>;
    onCancel: () => void;
};

function mapPayrollToFormValues(payroll: Payroll): PayrollFormValues {
    return {
        date: payroll.date,
        employeeName: payroll.employeeName,
        salaryAmount: payroll.salaryAmount,
        advanceGiven: payroll.advanceGiven,
        advanceDeduction: payroll.advanceDeduction,
        cashPaid: payroll.cashPaid,
        notes: payroll.notes ?? "",
    };
}

export default function PayrollEntryForm({
    selectedPayroll,
    onSubmit,
    onCancel,
}: PayrollEntryFormProps) {
    const [formValues, setFormValues] = useState<PayrollFormValues>(emptyPayrollFormValues);

    useEffect(() => {
        if (selectedPayroll) {
            setFormValues(mapPayrollToFormValues(selectedPayroll));
        } else {
            setFormValues(emptyPayrollFormValues);
        }
    }, [selectedPayroll]);

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value === "" ? 0 : Number(value),
        }));
    }

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit(formValues);
    }

    return (
        <Card className="border-slate-300">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    {selectedPayroll ? "Edit Payroll Entry" : "New Payroll Entry"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Fill in the payroll details below.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <TextInput
                        label="Date"
                        type="date"
                        name="date"
                        value={formatDateForInput(formValues.date)}
                        onChange={handleTextChange}
                    />

                    <TextInput
                        label="Employee Name"
                        type="text"
                        name="employeeName"
                        value={formValues.employeeName}
                        onChange={handleTextChange}
                        placeholder="Enter employee name"
                    />

                    <TextInput
                        label="Salary"
                        type="number"
                        name="salaryAmount"
                        value={formValues.salaryAmount}
                        onChange={handleNumberChange}
                        placeholder="0"
                    />

                    <TextInput
                        label="Advance Given"
                        type="number"
                        name="advanceGiven"
                        value={formValues.advanceGiven}
                        onChange={handleNumberChange}
                        placeholder="0"
                    />

                    <TextInput
                        label="Advance Deduction"
                        type="number"
                        name="advanceDeduction"
                        value={formValues.advanceDeduction}
                        onChange={handleNumberChange}
                        placeholder="0"
                    />

                    <TextInput
                        label="Cash Paid"
                        type="number"
                        name="cashPaid"
                        value={formValues.cashPaid}
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
                        value={formValues.notes}
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
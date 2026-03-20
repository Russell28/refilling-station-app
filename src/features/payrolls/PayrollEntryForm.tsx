import { useState, useEffect } from "react";
import { type Payroll, type PayrollFormValues, emptyPayrollFormValues } from "./Payroll";
import { formatDateForInput } from "../../utils/date";

type PayrollEntryFormProps = {
    selectedPayroll: Payroll | null;
    onSubmit: (formValues: PayrollFormValues) => Promise<void>;
    onCancel: () => void;
}

function mapPayrollToFormValues(payroll: Payroll) {
    return {
        date: payroll.date,
        employeeName: payroll.employeeName,
        salaryAmount: payroll.salaryAmount,
        advanceGiven: payroll.advanceGiven,
        advanceDeduction: payroll.advanceDeduction,
        cashPaid: payroll.cashPaid,
        notes: payroll.notes ?? ""
    };
}


export default function PayrollEntryForm({
    selectedPayroll,
    onSubmit,
    onCancel
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
        <div>
            <h2>Add Payroll Entry</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formatDateForInput(formValues.date)}
                        onChange={(e) => handleTextChange(e)} />
                </div>
                <div>
                    <label>Employee Name</label>
                    <input
                        type="text"
                        name="employeeName"
                        value={formValues.employeeName}
                        onChange={(e) => handleTextChange(e)} />
                </div>
                <div>
                    <label>Salary</label>
                    <input
                        type="number"
                        name="salaryAmount"
                        value={formValues.salaryAmount}
                        onChange={(e) => handleNumberChange(e)} />
                </div>

                <div>
                    <label>Advance Given</label>
                    <input
                        type="number"
                        name="advanceGiven"
                        value={formValues.advanceGiven}
                        onChange={(e) => handleNumberChange(e)} />
                </div>
                <div>
                    <label>Advance Deduction</label>
                    <input
                        type="number"
                        name="advanceDeduction"
                        value={formValues.advanceDeduction}
                        onChange={(e) => handleNumberChange(e)} />
                </div>
                <div>
                    <label>Cash Paid</label>
                    <input
                        type="number"
                        name="cashPaid"
                        value={formValues.cashPaid}
                        onChange={(e) => handleNumberChange(e)} />
                </div>
                <div>
                    <label>Notes</label>
                    <input
                        type="text"
                        name="notes"
                        value={formValues.notes}
                        onChange={(e) => handleTextChange(e)} />
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
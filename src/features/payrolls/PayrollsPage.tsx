import { useState, useEffect } from "react";
import type { Payroll, PayrollFormValues } from "./Payroll";
import { createPayroll, deletePayroll, getPayrolls, updatePayroll } from "./payrollApi";
import { formatDateForInput } from "../../utils/date";
import PayrollEntryForm from "./PayrollEntryForm";

export default function PayrollsPage() {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        const loadPayrolls = async () => {
            try {
                setLoading(true);
                setError(null);
                const payrolls = await getPayrolls();
                setPayrolls(payrolls);
            } catch (err) {
                console.error("Error loading payrolls:", err);
                setError("Failed to load payrolls.");
            } finally {
                setLoading(false);
            }
        };
        loadPayrolls();
    }, []);

    function onAddClick() {
        setSelectedPayroll(null); // clear any selected payroll when adding new
        setIsFormOpen(true);
    }

    function onEditClick(payroll: Payroll) {
        setSelectedPayroll(payroll);
        console.log("Edit payroll:", selectedPayroll);
        setIsFormOpen(true);
    }

    function handleCancel() {
        setSelectedPayroll(null);
        setIsFormOpen(false);
    }

    async function handleSubmit(formValues: PayrollFormValues) {
        try {
            setSaving(true);
            setFormError(null);
            if (selectedPayroll) {
                await updatePayroll(selectedPayroll.id, formValues);
            } else {
                await createPayroll(formValues);
            }

            // refresh list after save            
            const payrolls = await getPayrolls();
            setPayrolls(payrolls);
            setIsFormOpen(false);
            setSelectedPayroll(null);
        } catch (err) {
            setFormError("Failed to create payroll.");
        } finally {
            setSaving(false);
        }
    }

    async function onDeleteClick(payrollId: number) {
        const confirmed = window.confirm("Are you sure you want to delete this payroll entry?");
        if (!confirmed) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await deletePayroll(payrollId);
            // refresh list after delete
            const payrolls = await getPayrolls();
            setPayrolls(payrolls);
        } catch (err) {
            setError("Failed to delete payroll.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div>Loading payrolls...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Payrolls</h1>
            <button onClick={onAddClick}>New Entry</button>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Employee</th>
                        <th>Salary</th>
                        <th>Advance Given</th>
                        <th>Advance Deduction</th>
                        <th>Cash Paid</th>
                        <th>Notes</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {payrolls.map((payroll) => (
                        <tr key={payroll.id}>
                            <td>{formatDateForInput(payroll.date)}</td>
                            <td>{payroll.employeeName}</td>
                            <td>{payroll.salaryAmount}</td>
                            <td>{payroll.advanceGiven}</td>
                            <td>{payroll.advanceDeduction}</td>
                            <td>{payroll.cashPaid}</td>
                            <td>{payroll.notes}</td>
                            <td>
                                <button onClick={() => onEditClick(payroll)}>Edit</button>
                                <button onClick={() => onDeleteClick(payroll.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>

            {saving && <p>Saving payroll...</p>}
            {formError && <p style={{ color: "red" }}>{formError}</p>}
            {isFormOpen &&
                <PayrollEntryForm
                    selectedPayroll={selectedPayroll}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />}
        </div>
    );
}
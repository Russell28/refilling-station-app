import { useState, useEffect } from "react";
import type { Payroll } from "./Payroll";
import { getPayrolls } from "./payrollApi";
import { formatDateForInput } from "../../utils/date";

export default function PayrollEntriesPage() {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) {
        return <div>Loading payrolls...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Payrolls</h1>
            <button>New Entry</button>
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
                    </tr>
                </thead>
                <tbody>
                    {payrolls.map((p, index) => (
                        <tr key={index}>
                            <td>{formatDateForInput(p.date)}</td>
                            <td>{p.employee}</td>
                            <td>{p.salary}</td>
                            <td>{p.advanceGiven}</td>
                            <td>{p.advanceDeduction}</td>
                            <td>{p.cashPaid}</td>
                            <td>{p.notes}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}
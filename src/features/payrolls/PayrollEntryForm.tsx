import { useState, useEffect } from "react";
import { type CreateUpdatePayrollRequest, type Payroll, type PayrollFormValues, emptyPayrollFormValues } from "./Payroll";
import { formatDateForInput } from "../../utils/date";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import { useEmployees } from "../employees/EmployeeContext";
import Dropdown from "../../components/ui/Dropdown";



type PayrollEntryFormProps = {
    selectedPayroll: Payroll | null;
    onSubmit: (createRequest: CreateUpdatePayrollRequest) => Promise<void>;
    onCancel: () => void;
};

function mapPayrollToFormValues(payroll: Payroll): PayrollFormValues {
    return {
        earnedDate: payroll.earnedDate,
        paidDate: payroll?.paidDate ?? "", // Use empty string if paidDate is null or undefined
        employeeId: payroll.employeeId.toString(),
        salaryAmount: payroll.salaryAmount.toString(),
        cashPaid: payroll.cashPaid.toString(),
        notes: payroll.notes ?? "",
    };
}

function mapFormValuesToCreate(values: PayrollFormValues): CreateUpdatePayrollRequest {
    return {
        earnedDate: values.earnedDate,
        paidDate: values.paidDate,
        employeeId: Number(values.employeeId),
        salaryAmount: Number(values.salaryAmount || 0),
        cashPaid: Number(values.cashPaid || 0),
        notes: values.notes,
    };
}

export default function PayrollEntryForm({
    selectedPayroll,
    onSubmit,
    onCancel,
}: PayrollEntryFormProps) {
    const [formValues, setFormValues] = useState<PayrollFormValues>(emptyPayrollFormValues);
    const employees = useEmployees();

    useEffect(() => {
        if (selectedPayroll) {
            setFormValues(mapPayrollToFormValues(selectedPayroll));
        } else {
            setFormValues({
                ...emptyPayrollFormValues,
                employeeId: employees.length > 0 ? employees[0].id.toString() : '',
            });
        }
    }, [selectedPayroll, employees]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    //     const { name, value } = e.target;

    //     setFormValues((prev) => ({
    //         ...prev,
    //         [name]: value === "" ? 0 : Number(value),
    //     }));
    // }

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        onSubmit(mapFormValuesToCreate(formValues));
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
                        label="Earned Date"
                        type="date"
                        name="earnedDate"
                        value={formatDateForInput(formValues.earnedDate)}
                        onChange={handleInputChange}
                    />

                    <TextInput
                        label="Paid Date"
                        type="date"
                        name="paidDate"
                        value={formatDateForInput(formValues.paidDate)}
                        onChange={handleInputChange}
                    />

                    <Dropdown
                        label="Employee"
                        name="employeeId"
                        options={employees}
                        value={formValues.employeeId}
                        valueField="id"
                        onChange={handleInputChange}
                    />

                    {/* <TextInput
                        label="Employee Name"
                        type="text"
                        name="employeeName"
                        value={formValues.employeeName}
                        onChange={handleInputChange}
                        placeholder="Enter employee name"
                    /> */}

                    <TextInput
                        label="Salary"
                        type="number"
                        name="salaryAmount"
                        value={formValues.salaryAmount}
                        onChange={handleInputChange}
                    />

                    <TextInput
                        label="Cash Paid"
                        type="number"
                        name="cashPaid"
                        value={formValues.cashPaid}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
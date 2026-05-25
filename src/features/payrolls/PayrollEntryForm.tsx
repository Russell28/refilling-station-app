import { useState, useEffect } from "react";
import { type CreateUpdatePayrollRequest, type Payroll, type PayrollFormValues, emptyPayrollFormValues } from "./Payroll";
import { formatDateForInput } from "../../utils/date";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import { useEmployees } from "../employees/EmployeeContext";
import Dropdown from "../../components/ui/Dropdown";
import { useFormErrors } from "../../hooks/useFormErrors";
import { createPayroll, updatePayroll } from "./payrollApi";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";

type PayrollEntryFormProps = {
    selectedPayroll: Payroll | null;
    onSuccess: () => void;
    onCancel: () => void;
};

export default function PayrollEntryForm({
    selectedPayroll,
    onSuccess,
    onCancel,
}: PayrollEntryFormProps) {
    const [formValues, setFormValues] = useState<PayrollFormValues>(emptyPayrollFormValues);
    const employees = useEmployees();
    const [saving, setSaving] = useState(false);
    const { fieldErrors, generalErrors, applyErrors, clearErrors, setFieldErrors } = useFormErrors<PayrollFormValues>()

    useEffect(() => {
        if (selectedPayroll) {
            setFormValues(mapPayrollToFormValues(selectedPayroll));
        } else {
            setFormValues({
                ...emptyPayrollFormValues,
                employeeId: employees.length > 0 ? employees[0].id.toString() : '',
            });
        }
    }, [selectedPayroll]);

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


    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        await savePayroll();
    }

    async function savePayroll() {
        clearErrors();

        const clientErrors = validate(formValues);

        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors);
            return;
        }

        try {
            const payload = mapFormValuesToCreate(formValues);

            setSaving(true);

            if (selectedPayroll) {
                await updatePayroll(selectedPayroll.id, payload);
            } else {
                await createPayroll(payload);
            }
            
            onSuccess();

        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setSaving(false);
        }
    }

    function validate(values: PayrollFormValues) {
            const errors: Partial<Record<keyof PayrollFormValues, string[]>> = {}
    
            if (!values.earnedDate) {
                errors.earnedDate = ["Earned Date is required"]
            }
    
            if (!values.employeeId) {
                errors.employeeId = ["Employee is required"]
            }
    
            if (isNaN(Number(values.salaryAmount)) || Number(values.salaryAmount) < 0) {
                errors.salaryAmount = ["Salary must be a valid number and greater than or equal to zero"]
            }

            if (isNaN(Number(values.cashPaid)) || Number(values.cashPaid) < 0) {
                errors.cashPaid = ["Cash Paid must be a valid number and greater than or equal to zero"]
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
                            error={fieldErrors.earnedDate?.[0]}
                        />

                        <TextInput
                            label="Paid Date"
                            type="date"
                            name="paidDate"
                            value={formatDateForInput(formValues.paidDate)}
                            onChange={handleInputChange}
                            error={fieldErrors.paidDate?.[0]}
                        />

                        <Dropdown
                            label="Employee"
                            name="employeeId"
                            options={employees}
                            value={formValues.employeeId}
                            valueField="id"
                            onChange={handleInputChange}
                            error={fieldErrors.employeeId?.[0]}
                        />

                        <TextInput
                            label="Salary"
                            type="number"
                            name="salaryAmount"
                            value={formValues.salaryAmount}
                            onChange={handleInputChange}
                            error={fieldErrors.salaryAmount?.[0]}
                        />

                        <TextInput
                            label="Cash Paid"
                            type="number"
                            name="cashPaid"
                            value={formValues.cashPaid}
                            onChange={handleInputChange}
                            error={fieldErrors.cashPaid?.[0]}
                        />
                    </div>

                    <label className="block">
                        <TextInput
                            label="Notes"
                            type="text"
                            name="notes"
                            value={formValues.notes}
                            onChange={handleInputChange}
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
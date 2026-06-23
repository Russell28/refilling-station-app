import { useEffect, useState } from "react";
import { employeeRoleOptions, employmentTypeOptions, emptyEmployeeFormValues, type CreateEmployeeRequest, type Employee, type EmployeeFormValues } from "./Employee";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import Dropdown from "../../components/ui/Dropdown";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import { createEmployee, updateEmployee } from "./employeeApi";

type EmployeeFormProps = {
    selectedEmployee: Employee | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function EmployeeForm({
    selectedEmployee,
    onSuccess,
    onCancel
}: EmployeeFormProps) {
    const [employeeFormValues, setEmployeeFormValues] = useState<EmployeeFormValues>(emptyEmployeeFormValues);
    const [saving, setSaving] = useState(false);
    const { fieldErrors, generalErrors, applyErrors, clearErrors, setFieldErrors } = useFormErrors<EmployeeFormValues>()

    useEffect(() => {
        if (selectedEmployee) {
            setEmployeeFormValues({
                firstName: selectedEmployee.firstName,
                lastName: selectedEmployee.lastName,
                phoneNumber: selectedEmployee.phoneNumber,
                role: getOptionIdByName(employeeRoleOptions, selectedEmployee.role),
                employmentType: getOptionIdByName(employmentTypeOptions, selectedEmployee.employmentType)
            });
        } else {
            setEmployeeFormValues({
                ...emptyEmployeeFormValues
            });
        }
    }, [selectedEmployee]);

    function getOptionIdByName(options: { id: number; name: string }[], value: string) {
        return options.find((option) => option.name === value || String(option.id) === value)?.id.toString() ?? "";
    }

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setEmployeeFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function mapValuesToCreate(values: EmployeeFormValues): CreateEmployeeRequest {
        return {
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            role: Number(values.role || 0),
            employmentType: Number(values.employmentType || 0)
        };
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        await saveEmployee();
    }

    async function saveEmployee() {
        clearErrors();

        const clientErrors = validate(employeeFormValues);

        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors);
            return;
        }

        try {
            const payload = mapValuesToCreate(employeeFormValues);

            setSaving(true);

            if (selectedEmployee) {
                await updateEmployee(selectedEmployee.id, payload);
            } else {
                await createEmployee(payload);
            }

            onSuccess();

        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setSaving(false);
        }
    }

    function validate(values: EmployeeFormValues) {
        const errors: Partial<Record<keyof EmployeeFormValues, string[]>> = {}

        if (!values.firstName) {
            errors.firstName = ["First name is required."]
        }

        if (values.firstName.length < 3 || values.firstName.length > 20) {
            errors.firstName = ["First name must be between 3 and 20 characters long."]
        }

        if (!values.lastName) {
            errors.lastName = ["Last name is required."]
        }

        if (values.lastName.length < 3 || values.lastName.length > 20) {
            errors.lastName = ["Last name must be between 3 and 20 characters long."]
        }

        if (!values.phoneNumber) {
            errors.phoneNumber = ["Phone number is required."]
        }

        if (values.phoneNumber.length < 10 || values.phoneNumber.length > 13) {
            errors.phoneNumber = ["Phone number must be between 10 and 13 characters long."]
        }

        if (!values.role) {
            errors.role = ["Role is required."]
        }

        if (!values.employmentType) {
            errors.employmentType = ["Employment type is required."]
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
                        New Employee
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Fill in the employee details below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextInput
                            label="First Name"
                            type="text"
                            name="firstName"
                            value={employeeFormValues.firstName}
                            onChange={handleTextChange}
                            error={fieldErrors.firstName?.[0]}
                        />

                        <TextInput
                            label="Last Name"
                            type="text"
                            name="lastName"
                            value={employeeFormValues.lastName}
                            onChange={handleTextChange}
                            error={fieldErrors.lastName?.[0]}
                        />

                        <TextInput
                            label="Phone"
                            type="text"
                            name="phoneNumber"
                            value={employeeFormValues.phoneNumber}
                            onChange={handleTextChange}
                            error={fieldErrors.phoneNumber?.[0]}
                        />

                        <Dropdown
                            label="Role"
                            name="role"
                            options={employeeRoleOptions}
                            value={employeeFormValues.role}
                            valueField="id"
                            onChange={handleTextChange}
                            error={fieldErrors.role?.[0]}
                        />

                        <Dropdown
                            label="Employment Type"
                            name="employmentType"
                            options={employmentTypeOptions}
                            value={employeeFormValues.employmentType}
                            valueField="id"
                            onChange={handleTextChange}
                            error={fieldErrors.employmentType?.[0]}
                        />
                    </div>

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
import { useEffect, useState } from "react";
import type { Employee } from "./Employee";
import { getAllEmployees, activateEmployee, deactivateEmployee, deleteEmployee } from "./employeeApi";
import EmployeeForm from "./EmployeeForm";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import { FaEdit, FaTrash, FaUserPlus, FaUserSlash } from "react-icons/fa";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const { generalErrors, applyErrors, clearErrors } = useFormErrors<Employee>()

    useEffect(() => {
        loadEmployees();
    }, []);

    async function loadEmployees() {
        try {
            clearErrors();
            setLoading(true);
            const employeesData = await getAllEmployees();
            setEmployees(employeesData);
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    function onAddClick() {
        setSelectedEmployee(null); // clear any selected employee when adding new
        setIsFormOpen(true);
    }

    function onEditClick(employee: Employee) {
        setSelectedEmployee(employee);
        setIsFormOpen(true);
    }

    function handleCancel() {
        setSelectedEmployee(null);
        setIsFormOpen(false);
    }

    function onSuccess() {
        loadEmployees();
        setIsFormOpen(false);
        setSelectedEmployee(null);
    }

    async function onActivateClick(employee: Employee) {
        const confirmed = window.confirm(`Are you sure you want to activate employee "${employee.firstName} ${employee.lastName}"?`);
        if (!confirmed) {
            return;
        }

        try {
            clearErrors();
            setLoading(true);
            await activateEmployee(employee.id);
            await loadEmployees();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    async function onDeactivateClick(employee: Employee) {
        const confirmed = window.confirm(`Are you sure you want to deactivate employee "${employee.firstName} ${employee.lastName}"?`);
        if (!confirmed) {
            return;
        }

        try {
            clearErrors();
            setLoading(true);
            await deactivateEmployee(employee.id);
            await loadEmployees();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    async function onDeleteClick(employee: Employee) {
        const confirmed = window.confirm(`Are you sure you want to delete employee "${employee.firstName} ${employee.lastName}"?`);
        if (!confirmed) {
            return;
        }

        try {
            clearErrors();
            setLoading(true);
            await deleteEmployee(employee.id);
            await loadEmployees();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <PageHeader
                title="Employees"
                description="Manage employees."
                action={
                    <Button onClick={onAddClick}>
                        Add
                    </Button>
                }
            />

            {isFormOpen && (
                <EmployeeForm
                    selectedEmployee={selectedEmployee}
                    onSuccess={onSuccess}
                    onCancel={handleCancel}
                />
            )}

            {generalErrors.length > 0 && (
                <ServerErrorAlert errors={generalErrors} />
            )}

            <Card className="p-0">
                {loading ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">Loading employees...</p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">
                            No employees yet.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">

                            <table className="min-w-full text-sm border border-slate-200 rounded-lg shadow-sm">
                                <thead className="bg-slate-100 text-left text-slate-600">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Employee</th>
                                        <th className="px-4 py-3 font-semibold">Phone</th>
                                        <th className="px-4 py-3 font-semibold">Type</th>
                                        <th className="px-4 py-3 font-semibold">Role</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                        <th className="px-4 py-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {employees.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-800">{employee.firstName} {employee.lastName}</td>
                                            <td className="px-4 py-3 text-slate-700">{employee.phoneNumber}</td>
                                            <td className="px-4 py-3 text-slate-700">{employee.employmentType}</td>
                                            <td className="px-4 py-3 text-slate-700">{employee.role}</td>
                                            <td className="px-4 py-3">
                                                {employee.isActive ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                        <FaUserPlus className="h-3 w-3" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                                        <FaUserSlash className="h-3 w-3" /> Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                                                        onClick={() => onEditClick(employee)}
                                                    >
                                                        <FaEdit className="h-4 w-4" /> Edit
                                                    </button>
                                                    {!employee.isActive && (
                                                        <button
                                                            className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                                                            onClick={() => onActivateClick(employee)}
                                                        >
                                                            <FaUserPlus className="h-4 w-4" /> Activate
                                                        </button>
                                                    )}
                                                    {employee.isActive && (
                                                        <button
                                                            className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                                                            onClick={() => onDeactivateClick(employee)}
                                                        >
                                                            <FaUserSlash className="h-4 w-4" /> Deactivate
                                                        </button>
                                                    )}
                                                    <button
                                                        className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                                                        onClick={() => onDeleteClick(employee)}
                                                    >
                                                        <FaTrash className="h-4 w-4" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                        <div className="space-y-3 p-1 md:hidden">
                            {employees.map((employee) => (
                                <div
                                    key={employee.id}
                                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <p className="font-semibold text-slate-900 truncate">{employee.firstName} {employee.lastName}</p>
                                        <p className="text-sm font-medium text-slate-600">{employee.role}</p>
                                        <p
                                            className={`text-sm font-semibold ${employee.isActive ? "text-green-600" : "text-red-600"
                                                }`}
                                        >
                                            {employee.isActive ? "Active" : "Inactive"}
                                        </p>
                                    </div>

                                    {/* Footer actions */}
                                    <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-3 py-2">
                                        <button
                                            className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                            onClick={() => onEditClick(employee)}
                                        >
                                            <FaEdit className="h-3 w-3" /> Role
                                        </button>
                                        {!employee.isActive && (
                                            <button
                                                className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                                onClick={() => onActivateClick(employee)}
                                            >
                                                <FaUserPlus className="h-3 w-3" /> Activate
                                            </button>
                                        )}
                                        {employee.isActive && (
                                            <button
                                                className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                                onClick={() => onDeactivateClick(employee)}
                                            >
                                                <FaUserSlash className="h-3 w-3" /> Deactivate
                                            </button>
                                        )}
                                        <button
                                            className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                            onClick={() => onDeleteClick(employee)}
                                        >
                                            <FaTrash className="h-3 w-3" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </>
                )}
            </Card>
        </div>
    );
}

import { useEffect, useState } from "react";
import type { User } from "./User";
import { getUsers } from "./usersApi";
import UserCreateForm from "./UserCreateForm";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import UserChangePasswordForm from "./UserChangePasswordForm";
import UserChangeRoleForm from "./UserChangeRoleForm";
import { activateUser, deactivateUser, deleteUser } from "./usersApi";
import { FaEdit, FaTrash, FaKey, FaUserPlus, FaUserSlash } from "react-icons/fa";



type ActiveForm = "none" | "create" | "changePassword" | "changeRole";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeForm, setActiveForm] = useState<ActiveForm>("none");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { generalErrors, applyErrors, clearErrors } = useFormErrors<User>()

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            clearErrors();
            setLoading(true);
            const usersData = await getUsers();
            setUsers(usersData);
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    function onAddClick() {
        setActiveForm("create");
        setSelectedUser(null);
    }

    function onCancelClick() {
        setActiveForm("none");
        setSelectedUser(null);
    }

    function onSuccess() {
        loadUsers();
        setActiveForm("none");
        setSelectedUser(null);
    }

    function onChangePasswordClick(user: User) {
        setSelectedUser(user);
        setActiveForm("changePassword");
    }

    function onChangeRoleClick(user: User) {
        setSelectedUser(user);
        setActiveForm("changeRole");
    }

    async function onActivateClick(user: User) {
        const confirmed = window.confirm(`Are you sure you want to activate user "${user.username}"?`);
        if (!confirmed) {
            return;
        }

        try {
            clearErrors();
            setLoading(true);
            await activateUser(user.id);
            await loadUsers();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    async function onDeactivateClick(user: User) {
        const confirmed = window.confirm(`Are you sure you want to deactivate user "${user.username}"?`);
        if (!confirmed) {
            return;
        }

        try {
            clearErrors();
            setLoading(true);
            await deactivateUser(user.id);
            await loadUsers();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    async function onDeleteClick(user: User) {
        const confirmed = window.confirm(`Are you sure you want to delete user "${user.username}"?`);
        if (!confirmed) {
            return;
        }

        try {
            clearErrors();
            setLoading(true);
            await deleteUser(user.id);
            await loadUsers();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <PageHeader
                title="Users"
                description="Manage users."
                action={
                    <Button onClick={onAddClick}>
                        Add
                    </Button>
                }
            />

            {activeForm === "create" && (
                <UserCreateForm
                    onSuccess={onSuccess}
                    onCancel={onCancelClick}
                />
            )}

            {activeForm === "changePassword" && (
                <UserChangePasswordForm
                    selectedUser={selectedUser as User}
                    onSuccess={onSuccess}
                    onCancel={onCancelClick}
                />
            )}

            {activeForm === "changeRole" && (
                <UserChangeRoleForm
                    selectedUser={selectedUser as User}
                    onSuccess={onSuccess}
                    onCancel={onCancelClick}
                />
            )}

            {generalErrors.length > 0 && (
                <ServerErrorAlert errors={generalErrors} />
            )}

            <Card className="p-0">
                {loading ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-4">
                        <p className="text-sm text-slate-500">
                            No users yet.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden overflow-x-auto md:block">

                            <table className="min-w-full text-sm border border-slate-200 rounded-lg shadow-sm">
                                <thead className="bg-slate-100 text-left text-slate-600">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Username</th>
                                        <th className="px-4 py-3 font-semibold">Role</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                        <th className="px-4 py-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-800">{user.username}</td>
                                            <td className="px-4 py-3 text-slate-700">{user.role}</td>
                                            <td className="px-4 py-3">
                                                {user.isActive ? (
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
                                                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                                        onClick={() => onChangePasswordClick(user)}
                                                    >
                                                        <FaKey className="h-4 w-4" /> Password
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                                                        onClick={() => onChangeRoleClick(user)}
                                                    >
                                                        <FaEdit className="h-4 w-4" /> Role
                                                    </button>
                                                    {!user.isActive && (
                                                        <button
                                                            className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                                                            onClick={() => onActivateClick(user)}
                                                        >
                                                            <FaUserPlus className="h-4 w-4" /> Activate
                                                        </button>
                                                    )}
                                                    {user.isActive && (
                                                        <button
                                                            className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
                                                            onClick={() => onDeactivateClick(user)}
                                                        >
                                                            <FaUserSlash className="h-4 w-4" /> Deactivate
                                                        </button>
                                                    )}
                                                    <button
                                                        className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                                                        onClick={() => onDeleteClick(user)}
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
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <p className="font-semibold text-slate-900 truncate">{user.username}</p>
                                        <p className="text-sm font-medium text-slate-600">{user.role}</p>
                                        <p
                                            className={`text-sm font-semibold ${user.isActive ? "text-green-600" : "text-red-600"
                                                }`}
                                        >
                                            {user.isActive ? "Active" : "Inactive"}
                                        </p>
                                    </div>

                                    {/* Footer actions */}
                                    <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-3 py-2">
                                        <button
                                            className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                            onClick={() => onChangePasswordClick(user)}
                                        >
                                            <FaKey className="h-3 w-3" /> PW
                                        </button>
                                        <button
                                            className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                            onClick={() => onChangeRoleClick(user)}
                                        >
                                            <FaEdit className="h-3 w-3" /> Role
                                        </button>
                                        {!user.isActive && (
                                            <button
                                                className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                                onClick={() => onActivateClick(user)}
                                            >
                                                <FaUserPlus className="h-3 w-3" /> Activate
                                            </button>
                                        )}
                                        {user.isActive && (
                                            <button
                                                className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                                onClick={() => onDeactivateClick(user)}
                                            >
                                                <FaUserSlash className="h-3 w-3" /> Deactivate
                                            </button>
                                        )}
                                        <button
                                            className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                            onClick={() => onDeleteClick(user)}
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

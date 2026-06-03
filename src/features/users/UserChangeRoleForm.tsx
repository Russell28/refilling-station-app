import { useEffect, useState } from "react";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Dropdown from "../../components/ui/Dropdown";
import { type User, userRoleOptions } from "./User";
import { changeRole } from "./usersApi";

type UserChangeRoleFormProps = {
    selectedUser: User;
    onSuccess: () => void;
    onCancel: () => void;
};

type UserChangeRoleFormValues = {
    role: string;
}

export default function UserChangeRoleForm({
    selectedUser,
    onSuccess,
    onCancel
}: UserChangeRoleFormProps) {
    const [saving, setSaving] = useState(false);
    const [userChangeRoleFormValues, setUserChangeRoleFormValues] = useState<UserChangeRoleFormValues>({ role: selectedUser.role });
    const { fieldErrors, generalErrors, applyErrors, clearErrors, setFieldErrors } = useFormErrors<{ role: string }>()

    useEffect(() => {
        setUserChangeRoleFormValues({
            role: selectedUser.role,
        });
    }, [selectedUser]);

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setUserChangeRoleFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        await saveRole();
    }

    async function saveRole() {
        clearErrors();

        const clientErrors = validate(userChangeRoleFormValues);

        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors);
            return;
        }

        try {
            setSaving(true);
            await changeRole(selectedUser.id, userChangeRoleFormValues.role);

            onSuccess();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setSaving(false);
        }
    }

    function validate(values: UserChangeRoleFormValues) {
        const errors: Partial<Record<keyof UserChangeRoleFormValues, string[]>> = {}

        if (!values.role) {
            errors.role = ["Role is required."]
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
                        Change Role
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Update the role for user <strong>{selectedUser.username}</strong>.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Dropdown
                            label="Role"
                            name="role"
                            options={userRoleOptions}
                            value={userChangeRoleFormValues.role}
                            onChange={handleTextChange}
                            error={fieldErrors.role?.[0]}
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
import { useState } from "react";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import type { User } from "./User";
import { changePassword } from "./usersApi";

type UserChangePasswordFormProps = {
    selectedUser: User;
    onSuccess: () => void;
    onCancel: () => void;
};

type UserChangePasswordFormValues = {
    password: string;
    confirmPassword: string;
}

export default function UserChangePasswordForm({
    selectedUser,
    onSuccess,
    onCancel
}: UserChangePasswordFormProps) {
    const [saving, setSaving] = useState(false);
    const [userChangePasswordFormValues, setUserChangePasswordFormValues] = useState<UserChangePasswordFormValues>({ password: "", confirmPassword: "" });
    const { fieldErrors, generalErrors, applyErrors, clearErrors, setFieldErrors } = useFormErrors<{ password: string; confirmPassword: string }>()

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setUserChangePasswordFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        await savePassword();
    }

    async function savePassword() {
        clearErrors();

        const clientErrors = validate(userChangePasswordFormValues);

        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors);
            return;
        }

        try {
            setSaving(true);
            await changePassword(selectedUser.id, userChangePasswordFormValues.password);

            onSuccess();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setSaving(false);
        }
    }

    function validate(values: UserChangePasswordFormValues) {
        const errors: Partial<Record<keyof UserChangePasswordFormValues, string[]>> = {}

        if (!values.password) {
            errors.password = ["Password is required."]
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = ["Confirm Password is required."]
        }

        if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
            errors.confirmPassword = ["Passwords do not match."]
        }

        if (values.password.length < 7 || values.password.length > 50) {
            errors.password = ["Password must be between 7 and 50 characters long."]
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
                        Change Password
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Enter a new password for user <strong>{selectedUser.username}</strong>.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextInput
                            label="Password"
                            type="password"
                            name="password"
                            value={userChangePasswordFormValues.password}
                            onChange={handleTextChange}
                            error={fieldErrors.password?.[0]}
                        />
                        <TextInput
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={userChangePasswordFormValues.confirmPassword}
                            onChange={handleTextChange}
                            error={fieldErrors.confirmPassword?.[0]}
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
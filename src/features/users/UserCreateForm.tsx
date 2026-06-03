import { useEffect, useState } from "react";
import { emptyUserFormValues, userRoleOptions, type CreateUserRequest, type UserFormValues } from "./User";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import Dropdown from "../../components/ui/Dropdown";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import { createUser } from "./usersApi";

type UserCreateFormProps = {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function UserCreateForm({
    onSuccess,
    onCancel
}: UserCreateFormProps) {
    const [userFormValues, setUserFormValues] = useState<UserFormValues>(emptyUserFormValues);
    const [saving, setSaving] = useState(false);
    const { fieldErrors, generalErrors, applyErrors, clearErrors, setFieldErrors } = useFormErrors<UserFormValues>()

    useEffect(() => {
        setUserFormValues({
            ...emptyUserFormValues
            
        });

    }, []);

    function handleTextChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setUserFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function mapValuesToCreate(values: UserFormValues): CreateUserRequest {
        return {
            username: values.username,
            password: values.password,
            role: values.role,
        };
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        await saveUser();
    }

    async function saveUser() {
        clearErrors();

        const clientErrors = validate(userFormValues);

        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors);
            return;
        }

        var payload = mapValuesToCreate(userFormValues);

        try {
            setSaving(true);
            await createUser(payload);

            onSuccess();
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setSaving(false);
        }
    }

    function validate(values: UserFormValues) {
        const errors: Partial<Record<keyof UserFormValues, string[]>> = {}

        if (!values.username) {
            errors.username = ["Username is required."]
        }

        if (values.username.length < 5 || values.username.length > 20) {
            errors.username = ["Username must be between 5 and 20 characters long."]
        }

        if (!values.password) {
            errors.password = ["Password is required."]
        }

        if (values.password.length < 7 || values.password.length > 50) {
            errors.password = ["Password must be between 7 and 50 characters long."]
        }

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
                        New User
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Fill in the user details below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextInput
                            label="Username"
                            type="text"
                            name="username"
                            value={userFormValues.username}
                            onChange={handleTextChange}
                            error={fieldErrors.username?.[0]}
                        />

                        <TextInput
                            label="Password"
                            type="password"
                            name="password"
                            value={userFormValues.password}
                            onChange={handleTextChange}
                            error={fieldErrors.password?.[0]}
                        />

                        <Dropdown
                            label="Role"
                            name="role"
                            options={userRoleOptions}
                            value={userFormValues.role}
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
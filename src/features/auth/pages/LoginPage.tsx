import { useState } from "react";
import type { LoginRequest } from "../types/auth";
import { login, getMe } from "../api/authApi";
import { clearAuth, isAuthenticated, saveAuth, saveUserDetails } from "../utils/authStorage";
import { Navigate, useNavigate } from "react-router";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import TextInput from "../../../components/ui/TextInput";
import { useFormErrors } from "../../../hooks/useFormErrors";
import { ServerErrorAlert } from "../../../components/ui/ServerErrorAlert";
import type { ErrorResponse } from "../../../types/ErrorResponse";


type LoginFormValues = {
    username: string;
    password: string;
}

export default function LoginPage() {
    if (isAuthenticated()) { // If already logged in, redirect to dashboard
        return <Navigate to="/" replace />;
    }

    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<LoginFormValues>({ username: "", password: "" });
    const { fieldErrors, generalErrors, applyErrors, clearErrors, setFieldErrors } = useFormErrors<LoginFormValues>()
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        clearErrors();

        // Validation
        const validationErrors = validate(formValues);
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            const loginRequest: LoginRequest = {
                username: formValues.username.trim(),
                password: formValues.password
            };
            const response = await login(loginRequest);

            if (response.accessToken) {
                // Login successful
                // Save auth info to memory
                saveAuth(response.accessToken);

                const user = await getMe(); // Fetch user info after login
                saveUserDetails(user.username, user.role); // Save user details

                navigate("/"); // Redirect to dashboard after successful login
            }
        } catch (err) {
            clearAuth(); // Clear any auth info in case of error (e.g. invalid credentials)
            applyErrors(err as ErrorResponse);
        } finally {
            setIsSubmitting(false);
        }
    }

    function validate(values: LoginFormValues): Partial<Record<keyof LoginFormValues, string[]>> {
        const errors: Partial<Record<keyof LoginFormValues, string[]>> = {}

        if (!values.username.trim()) {
            errors.username = ["Username is required"]
        }

        if (!values.password.trim()) {
            errors.password = ["Password is required"]
        }

        return errors
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md">
                <Card>
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Sign in
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Enter your account credentials to continue.
                        </p>
                    </div>

                    {generalErrors.length > 0 && <ServerErrorAlert errors={generalErrors} />}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextInput
                            label="Username"
                            type="text"
                            value={formValues.username}
                            onChange={(e) => setFormValues({ ...formValues, username: e.target.value })}
                            disabled={isSubmitting}
                            error={fieldErrors.username?.[0]}
                        />

                        <TextInput
                            label="Password"
                            type="password"
                            value={formValues.password}
                            onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
                            disabled={isSubmitting}
                            error={fieldErrors.password?.[0]}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
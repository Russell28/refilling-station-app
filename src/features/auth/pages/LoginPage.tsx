import { useState } from "react";
import type { LoginRequest } from "../types/auth";
import { login } from "../api/authApi";
import { saveAuth } from "../utils/authStorage";
import { useNavigate } from "react-router";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import TextInput from "../../../components/ui/TextInput";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!username.trim() || !password.trim()) {
            setError("Username and password are required.");
            return;
        }

        try {
            setIsSubmitting(true);
            const loginRequest: LoginRequest = {
                username: username.trim(),
                password: password
            };
            const response = await login(loginRequest);

            // Save auth info to localStorage
            saveAuth(response.token, response.username, response.role);
            navigate("/"); // Redirect to dashboard after successful login
        } catch (err) {
            setError("Invalid username or password.");
        } finally {
            setIsSubmitting(false);
        }
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextInput
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isSubmitting}
                        />

                        <TextInput
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                        />

                        {error ? (
                            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </div>
                        ) : null}

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
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { useState } from "react";
import PayrollEntriesPage from "./payroll-entries/PayrollEntriesPage";
import PayrollPaymentsPage from "./payroll-payments/PayrollPaymentsPage";

export default function PayrollsPage() {
    const [activeTab, setActiveTab] = useState<"entries" | "payments">("entries");

    return (
        <div className="space-y-4">
            <PageHeader
                title="Payroll"
                description="Track employee salary, advances, and cash paid."
            />

            {/* Tab Navigation */}
            <div className="tabs space-x-2">
                <Button
                    variant={activeTab === "entries" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("entries")}
                >
                    Entries
                </Button>
                <Button
                    variant={activeTab === "payments" ? "primary" : "secondary"}
                    onClick={() => setActiveTab("payments")}
                >
                    Payments
                </Button>
            </div>

            {/* Tab Content */}
            {activeTab === "entries" && (
                <PayrollEntriesPage />
            )}
            {activeTab === "payments" && (
                <PayrollPaymentsPage />
            )}
        </div>
    );
}
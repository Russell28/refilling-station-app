import { useState, useEffect } from "react";
import { getMonthlySummary } from "./monthlySummaryApi";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import type { MonthlySummaryResponse } from "./MonthlySummary";
import { getCurrentMonthInputValue } from "../../utils/date";
import { saveMonthlySummary } from "./monthlySummaryApi";
import { useMemo } from "react";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(amount);
}

export default function MonthlySummaryPage() {
    const [month, setMonth] = useState(getCurrentMonthInputValue());
    const [summary, setSummary] = useState<MonthlySummaryResponse | null>(null);

    const [managerShare, setManagerShare] = useState("0");
    const [ownerShare, setOwnerShare] = useState("0");
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    async function loadSummary(selectedMonth = month) {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage(null);

            const data = await getMonthlySummary(selectedMonth);
            setSummary(data);

            setManagerShare(
                data.savedClosing?.managerShare?.toString() ?? "0"
            );
            setOwnerShare(
                data.savedClosing?.ownerShare?.toString() ?? "0"
            );
            setNotes(data.savedClosing?.notes ?? "");
        } catch (err) {
            console.error("Failed to load monthly summary.", err);
            setError("Failed to load monthly summary.");
            setSummary(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleGenerate() {
        await loadSummary(month);
    }

    async function handleSave() {
        if (!summary) {
            return;
        }

        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);

            const managerShareValue = Number(managerShare) || 0;
            const ownerShareValue = Number(ownerShare) || 0;

            const result = await saveMonthlySummary({
                month,
                managerShare: managerShareValue,
                ownerShare: ownerShareValue,
                notes,
            });

            setSuccessMessage(result.message);
            await loadSummary(month);
        } catch (err) {
            console.error("Failed to save monthly summary.", err);
            setError("Failed to save monthly summary.");
        } finally {
            setSaving(false);
        }
    }

    const remainingBalance = useMemo(() => {
        if (!summary) {
            return 0;
        }

        const managerShareValue = Number(managerShare) || 0;
        const ownerShareValue = Number(ownerShare) || 0;

        return summary.netProfit - managerShareValue - ownerShareValue;
    }, [summary, managerShare, ownerShare]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Monthly Summary"
                description="Review monthly profit and save manual owner and manager shares."
            />

            <Card>
                <div className="grid gap-4 md:grid-cols-3">
                    <TextInput
                        label="Month"
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    />

                    <div className="md:col-span-2 flex items-end">
                        <Button
                            type="button"
                            onClick={handleGenerate}
                            className="w-full md:w-auto"
                        >
                            Generate
                        </Button>
                    </div>
                </div>
            </Card>

            {loading && (
                <Card>
                    <p className="text-sm text-slate-600">
                        Loading monthly summary...
                    </p>
                </Card>
            )}

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <p className="text-sm text-red-700">{error}</p>
                </Card>
            )}

            {successMessage && (
                <Card className="border-green-200 bg-green-50">
                    <p className="text-sm text-green-700">{successMessage}</p>
                </Card>
            )}

            {summary && !loading && (
                <>
                    <section>
                        <h3 className="mb-3 text-lg font-semibold text-slate-900">
                            Computed Summary
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <SummaryCard
                                label="Cash Collected"
                                value={formatCurrency(summary.totalCashCollected)}
                            />
                            <SummaryCard
                                label="Expenses"
                                value={formatCurrency(summary.totalExpenses)}
                            />
                            <SummaryCard
                                label="Payroll Earned"
                                value={formatCurrency(summary.totalPayrollEarned)}
                            />
                            <SummaryCard
                                label="Net Profit"
                                value={formatCurrency(summary.netProfit)}
                            />
                        </div>
                    </section>

                    <Card>
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">
                            Profit Share
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <TextInput
                                label="Manager Share"
                                type="number"
                                min="0"
                                step="0.01"
                                value={managerShare}
                                onChange={(e) => setManagerShare(e.target.value)}
                            />

                            <TextInput
                                label="Owner Share"
                                type="number"
                                min="0"
                                step="0.01"
                                value={ownerShare}
                                onChange={(e) => setOwnerShare(e.target.value)}
                            />
                        </div>

                        <div className="mt-4">
                            <TextInput
                                label="Notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Optional notes for this month closing"
                            />
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <SummaryCard
                                label="Manager Share"
                                value={formatCurrency(Number(managerShare) || 0)}
                            />
                            <SummaryCard
                                label="Owner Share"
                                value={formatCurrency(Number(ownerShare) || 0)}
                            />
                            <SummaryCard
                                label="Remaining Balance"
                                value={formatCurrency(remainingBalance)}
                            />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Monthly Summary"}
                            </Button>
                        </div>
                    </Card>

                    {summary.savedClosing && (
                        <Card>
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                Saved Closing
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <SummaryCard
                                    label="Manager Share"
                                    value={formatCurrency(summary.savedClosing.managerShare)}
                                />
                                <SummaryCard
                                    label="Owner Share"
                                    value={formatCurrency(summary.savedClosing.ownerShare)}
                                />
                                <SummaryCard
                                    label="Saved At"
                                    value={new Date(
                                        summary.savedClosing.createdAt
                                    ).toLocaleString()}
                                />
                                <SummaryCard
                                    label="Notes"
                                    value={summary.savedClosing.notes || "-"}
                                />
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}

type SummaryCardProps = {
    label: string;
    value: string;
};

function SummaryCard({ label, value }: SummaryCardProps) {
    return (
        <Card>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
        </Card>
    );
}
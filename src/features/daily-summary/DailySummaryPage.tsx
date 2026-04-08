import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import TextInput from "../../components/ui/TextInput";
import { formatDateForInput } from "../../utils/date"

type DailySummary = {
    date: string;
    tripCount: number;
    backlogStartQty: number;
    totalCollectedQty: number;
    totalLoadedQty: number;
    totalDeliveredQty: number;
    backlogEndQty: number;
    totalFreeQty: number;
    totalActualPaidQty: number;
    totalReturnedQty: number;
    totalReplacementQty: number;
    totalCashCollected: number;
    totalExpenses: number;
    totalPayrollPaid: number;
    totalDebtCreatedToday: number;
    totalDebtPaymentsToday: number;
    outstandingDebt: number;
    netCashFlow: number;
};

function getTodayLocalDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function SummaryMetricCard({
    label,
    value,
    valueClassName = "text-slate-900",
}: {
    label: string;
    value: string | number;
    valueClassName?: string;
}) {
    return (
        <Card>
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`mt-2 text-2xl font-semibold ${valueClassName}`}>
                {value}
            </p>
        </Card>
    );
}

export default function DailySummaryPage() {
    const [selectedDate, setSelectedDate] = useState(getTodayLocalDate()); // Initialize with today's date
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<DailySummary | null>(null);

    async function handleLoadSummary() {
        if (!selectedDate) {
            setError("Please select a date.");
            setSummary(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get(`/daily-summary/${selectedDate}`);
            setSummary(response.data);
        } catch (error) {
            setError("Failed to load daily summary.");
            setSummary(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleLoadSummary();
    }, [selectedDate]);

    return (
        <div className="space-y-4">
            <PageHeader
                title="Daily Summary"
                description="View trips, collections, expenses, payroll, and cash flow for a selected date."
            />

            <Card>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="w-full sm:max-w-xs">
                        <TextInput
                            label="Select Date"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    {/* Optional if you want manual load instead of auto-load on date change */}
                    {/* <Button onClick={handleLoadSummary} disabled={loading}>
                        {loading ? "Loading..." : "Load Summary"}
                    </Button> */}
                </div>
            </Card>

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <p className="text-sm text-red-700">{error}</p>
                </Card>
            )}

            {loading && (
                <Card>
                    <p className="text-sm text-slate-500">Loading summary...</p>
                </Card>
            )}

            {summary && !loading && (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryMetricCard
                            label="Net Cash Flow"
                            value={`₱${summary.netCashFlow.toLocaleString()}`}
                            valueClassName={
                                summary.netCashFlow >= 0
                                    ? "text-emerald-600"
                                    : "text-red-600"
                            }
                        />
                        <SummaryMetricCard
                            label="Total Cash Collected"
                            value={`₱${summary.totalCashCollected.toLocaleString()}`}
                        />
                        <SummaryMetricCard
                            label="Total Expenses"
                            value={`₱${summary.totalExpenses.toLocaleString()}`}
                        />
                        <SummaryMetricCard
                            label="Total Salary Paid"
                            value={`₱${summary.totalPayrollPaid.toLocaleString()}`}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <Card>
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                Trip Summary
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Date</span>
                                    <span className="font-medium text-slate-900">
                                        {formatDateForInput(summary.date)}{" "}
                                        ({new Date(summary.date).toLocaleDateString("en-US", { weekday: "short" })})
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Trip Count</span>
                                    <span className="font-medium text-slate-900">
                                        {summary.tripCount}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Backlog Start</span>
                                    <span className="font-medium text-slate-900">
                                        {summary.backlogStartQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Collected Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {summary.totalCollectedQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Delivered Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {summary.totalDeliveredQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Backlog End</span>
                                    <span className="font-semibold text-blue-600">
                                        {summary.backlogEndQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Free Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {summary.totalFreeQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Returned Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {summary.totalReturnedQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Replacement Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {summary.totalReplacementQty}
                                    </span>
                                </div>

                                {/* Optional extra trip metrics */}
                                {/* <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Loaded Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {summary.totalLoadedQty}
                                    </span>
                                </div> */}

                                {/* <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total To Be Paid Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {summary.totalToBePaidQty}
                                    </span>
                                </div> */}

                                {/* <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Actual Paid Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {summary.totalActualPaidQty}
                                    </span>
                                </div> */}
                            </div>
                        </Card>

                        <Card>
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                Financial Summary
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Cash Collected</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{summary.totalCashCollected.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Expenses</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{summary.totalExpenses.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Salary Paid</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{summary.totalPayrollPaid.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Debt Created Today</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{summary.totalDebtCreatedToday.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Debt Payments Today</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{summary.totalDebtPaymentsToday.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Outstanding Debt</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{summary.outstandingDebt.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                                    <span className="font-medium text-slate-700">
                                        Net Cash Flow
                                    </span>
                                    <span
                                        className={`font-semibold ${summary.netCashFlow >= 0
                                                ? "text-emerald-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        ₱{summary.netCashFlow.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
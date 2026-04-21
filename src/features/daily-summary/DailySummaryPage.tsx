import { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import TextInput from "../../components/ui/TextInput";
import { formatDateForInput } from "../../utils/date"
import { isAdmin } from "../auth/utils/authStorage";
import type { DailySummaryResponse } from "./DailySummary";
import { getDailySummary } from "./dailySummaryApi";

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

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(amount);
}

function TableHeader({ children }: { children: React.ReactNode }) {
    return <th className="px-4 py-2 font-semibold">{children}</th>;
}

function TableCell({ children }: { children: React.ReactNode }) {
    return <td className="px-4 py-2">{children}</td>;
}

export default function DailySummaryPage() {
    const [selectedDate, setSelectedDate] = useState(getTodayLocalDate()); // Initialize with today's date
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [dailySummary, setDailySummary] = useState<DailySummaryResponse | null>(null);

    async function handleLoadSummary() {
        if (!selectedDate) {
            setError("Please select a date.");
            setDailySummary(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await getDailySummary(selectedDate);
            setDailySummary(response);
        } catch (error) {
            setError("Failed to load daily summary.");
            setDailySummary(null);
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
                            label={isAdmin() ? "Select Date" : "Date"}
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            readOnly={!isAdmin()} 
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

            {dailySummary && !loading && (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryMetricCard
                            label="Net Cash Flow"
                            value={`₱${dailySummary.summary.netCashFlow.toLocaleString()}`}
                            valueClassName={
                                dailySummary.summary.netCashFlow >= 0
                                    ? "text-emerald-600"
                                    : "text-red-600"
                            }
                        />
                        <SummaryMetricCard
                            label="Total Cash Collected"
                            value={`₱${dailySummary.summary.totalCashCollected.toLocaleString()}`}
                        />
                        <SummaryMetricCard
                            label="Total Expenses"
                            value={`₱${dailySummary.summary.totalExpenses.toLocaleString()}`}
                        />
                        {isAdmin() && (
                            <SummaryMetricCard
                                label="Total Salary Paid"
                                value={`₱${dailySummary.summary.totalPayrollPaid.toLocaleString()}`}
                            />
                        )}
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
                                        {formatDateForInput(dailySummary.summary.date)}{" "}
                                        ({new Date(dailySummary.summary.date).toLocaleDateString("en-US", { weekday: "short" })})
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Trip Count</span>
                                    <span className="font-medium text-slate-900">
                                        {dailySummary.summary.tripCount}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Backlog Start</span>
                                    <span className="font-medium text-slate-900">
                                        {dailySummary.summary.backlogStartQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Collected Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {dailySummary.summary.totalCollectedQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Delivered Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {dailySummary.summary.totalDeliveredQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Backlog End</span>
                                    <span className="font-semibold text-blue-600">
                                        {dailySummary.summary.backlogEndQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Free Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {dailySummary.summary.totalFreeQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Returned Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {dailySummary.summary.totalReturnedQty}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Replacement Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {dailySummary.summary.totalReplacementQty}
                                    </span>
                                </div>

                                {/* Optional extra trip metrics */}
                                {/* <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Loaded Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {dailySummary.summary.totalLoadedQty}
                                    </span>
                                </div> */}

                                {/* <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total To Be Paid Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {dailySummary.summary.totalToBePaidQty}
                                    </span>
                                </div> */}

                                {/* <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Actual Paid Qty</span>
                                    <span className="font-medium text-slate-900">
                                        {dailySummary.summary.totalActualPaidQty}
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
                                        ₱{dailySummary.summary.totalCashCollected.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Total Expenses</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{dailySummary.summary.totalExpenses.toLocaleString()}
                                    </span>
                                </div>

                                {isAdmin() && (
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Total Salary Paid</span>
                                        <span className="font-medium text-slate-900">
                                            ₱{dailySummary.summary.totalPayrollPaid.toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Debt Created Today</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{dailySummary.summary.totalDebtCreatedToday.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Debt Payments Today</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{dailySummary.summary.totalDebtPaymentsToday.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">Outstanding Debt</span>
                                    <span className="font-medium text-slate-900">
                                        ₱{dailySummary.summary.outstandingDebt.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                                    <span className="font-medium text-slate-700">
                                        Net Cash Flow
                                    </span>
                                    <span
                                        className={`font-semibold ${dailySummary.summary.netCashFlow >= 0
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        ₱{dailySummary.summary.netCashFlow.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card>
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">
                            Debt Breakdown
                        </h3>

                        {dailySummary.debtBreakdown.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No debt records found for this date.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-left text-slate-600">
                                        <tr>
                                            <TableHeader>Date</TableHeader>
                                            <TableHeader>Customer</TableHeader>
                                            {/* <TableHeader>Debt Created</TableHeader>
                                            <TableHeader>Debt Payments</TableHeader> */}
                                            <TableHeader>Balance</TableHeader>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailySummary.debtBreakdown.map((item) => (
                                            <tr
                                                key={item.customerName}
                                                className="border-t border-slate-200"
                                            >
                                                <TableCell>{formatDateForInput(item.latestTransactionDate)}</TableCell>
                                                <TableCell>{item.customerName}</TableCell>
                                                {/* <TableCell>
                                                    {formatCurrency(item.debtCreated)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(item.debtPayments)}
                                                </TableCell> */}
                                                <TableCell>{formatCurrency(item.balance)}</TableCell>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
}
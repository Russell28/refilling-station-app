import { useEffect, useState } from "react";
import {
    formatDateForInput,
    getFirstDayOfCurrentMonth,
    getToday
} from "../../../utils/date";
import type { DashboardResponse } from "./Dashboard";
import { getDashboard } from "./dashboardApi";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import PageHeader from "../../../components/ui/PageHeader";
import TextInput from "../../../components/ui/TextInput";

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(amount);
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("en-PH").format(value);
}

export default function DashboardPage() {
    const [startDate, setStartDate] = useState(
        formatDateForInput(getFirstDayOfCurrentMonth())
    );
    const [endDate, setEndDate] = useState(
        formatDateForInput(getToday())
    );
    const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [employeeFilter, setEmployeeFilter] = useState("");

    async function loadDashboard() {
        setLoading(true);
        setError(null);
        try {
            const dashboardData = await getDashboard(startDate, endDate);
            setDashboard(dashboardData);
        } catch (err) {
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    function handleApplyFilters() {
        loadDashboard();
    }




    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="View summary reports for a selected date range."
            />

            <Card>
                <div className="grid gap-4 md:grid-cols-3">
                    <TextInput
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />

                    <TextInput
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />

                    <div className="flex items-end">
                        <Button
                            type="button"
                            onClick={handleApplyFilters}
                            className="w-full"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </Card>

            {loading && (
                <Card>
                    <p className="text-sm text-slate-600">Loading dashboard...</p>
                </Card>
            )}

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <p className="text-sm text-red-700">{error}</p>
                </Card>
            )}

            {dashboard && !loading && (
                <>
                    <section>
                        <h3 className="mb-3 text-lg font-semibold text-slate-900">
                            Summary
                        </h3>

                        {/* OPERATIONS */}
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Operations</h4>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <SummaryCard
                                    label="Trip Count"
                                    value={formatNumber(dashboard.summary.totalTrips)}
                                />
                                <SummaryCard
                                    label="Collected Qty"
                                    value={formatNumber(dashboard.summary.totalCollectedQty)}
                                />
                                <SummaryCard
                                    label="Delivered Qty"
                                    value={formatNumber(dashboard.summary.totalDeliveredQty)}
                                />
                                <SummaryCard
                                    label="Backlog End"
                                    value={formatNumber(dashboard.summary.backlogEndQty)}
                                />
                            </div>
                        </div>

                        {/* CASHFLOW */}
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Cashflow</h4>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <SummaryCard
                                    label="Cash Collected"
                                    value={formatCurrency(dashboard.summary.totalCashCollected)}
                                />
                                <SummaryCard
                                    label="Expenses"
                                    value={formatCurrency(dashboard.summary.totalExpense)}
                                />
                                <SummaryCard
                                    label="Net After Expense"
                                    value={formatCurrency(dashboard.summary.netAfterExpense)}
                                />
                                <SummaryCard
                                    label="Net After Payroll"
                                    value={formatCurrency(dashboard.summary.netAfterPayroll)}
                                />
                            </div>
                        </div>

                        {/* PAYROLL */}
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Payroll</h4>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <SummaryCard
                                    label="Payroll Earned"
                                    value={formatCurrency(dashboard.summary.totalPayrollEarned)}
                                />
                                <SummaryCard
                                    label="Outstanding Payroll"
                                    value={formatCurrency(dashboard.summary.outstandingPayroll)}
                                />
                            </div>
                        </div>

                        {/* LIABILITIES */}
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Liabilities</h4>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <SummaryCard
                                    label="Outstanding Debt"
                                    value={formatCurrency(dashboard.summary.outstandingDebt)}
                                />
                            </div>
                        </div>

                        {/* UNIT ECONOMICS */}
                        <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Unit Economics</h4>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <SummaryCard
                                    label="Cost per Gallon"
                                    value={formatCurrency(dashboard.summary.costPerGallon)}
                                />
                                <SummaryCard
                                    label="Retail per Gallon"
                                    value={formatCurrency(dashboard.summary.retailPerGallon)}
                                />
                                <SummaryCard
                                    label="Profit per Gallon"
                                    value={formatCurrency(dashboard.summary.profitPerGallon)}
                                />
                            </div>
                        </div>
                    </section>

                    <Card>
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">
                            Daily Reports
                        </h3>

                        {dashboard.dailyReports.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No daily reports found for selected range.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-left text-slate-600">
                                        <tr>
                                            <TableHeader>Date</TableHeader>
                                            {/* <TableHeader>Trips</TableHeader>
                                            <TableHeader>Collected</TableHeader> */}
                                            <TableHeader>Delivered</TableHeader>
                                            <TableHeader>Cash</TableHeader>
                                            <TableHeader>Expense</TableHeader>
                                            <TableHeader>Net</TableHeader>
                                            {/* <TableHeader>Payroll</TableHeader>
                                            <TableHeader>Debt</TableHeader>
                                            <TableHeader>Payment</TableHeader> */}
                                            {/* <TableHeader>Backlog End</TableHeader> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.dailyReports.map((item) => (
                                            <tr key={item.date} className="border-t border-slate-200">
                                                <TableCell>{formatDateForInput(item.date)}</TableCell>
                                                {/* <TableCell>{formatNumber(item.tripCount)}</TableCell> */}
                                                {/* <TableCell>{formatNumber(item.totalCollectedQty)}</TableCell> */}
                                                <TableCell>{formatNumber(item.totalDeliveredQty)}</TableCell>
                                                <TableCell>{formatCurrency(item.totalCashCollected)}</TableCell>
                                                <TableCell>{formatCurrency(item.totalExpenses)}</TableCell>
                                                <TableCell>{formatCurrency(item.cashAfterExpense)}</TableCell>
                                                {/* <TableCell>{formatCurrency(item.totalPayrollEarned)}</TableCell> */}
                                                {/* <TableCell>{formatCurrency(item.totalDebtCreated)}</TableCell> */}
                                                {/* <TableCell>{formatCurrency(item.totalDebtPayment)}</TableCell> */}
                                                {/* <TableCell>{formatNumber(item.backlogEndQty)}</TableCell> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>

                    <div className="grid gap-6 xl:grid-cols-3">
                        <Card>
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                Expense Breakdown
                            </h3>

                            {dashboard.expenseBreakdown.items.length === 0 ? (
                                <p className="text-sm text-slate-500">
                                    No expenses found for selected range.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-slate-50 text-left text-slate-600">
                                            <tr>
                                                <TableHeader>Category</TableHeader>
                                                <TableHeader>Total</TableHeader>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboard.expenseBreakdown.items.map((item) => (
                                                <tr
                                                    key={item.expenseCategoryId}
                                                    className="border-t border-slate-200"
                                                >
                                                    <TableCell>{item.categoryName}</TableCell>
                                                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>

                        <Card>
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                Debt Breakdown
                            </h3>

                            {dashboard.debtBreakdown.items.length === 0 ? (
                                <p className="text-sm text-slate-500">
                                    No debt records found.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-slate-50 text-left text-slate-600">
                                            <tr>
                                                <TableHeader>Customer</TableHeader>
                                                <TableHeader>Debt</TableHeader>
                                                <TableHeader>Payments</TableHeader>
                                                <TableHeader>Balance</TableHeader>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboard.debtBreakdown.items.map((item) => (
                                                <tr
                                                    key={item.customerName}
                                                    className="border-t border-slate-200"
                                                >
                                                    <TableCell>{item.customerName}</TableCell>
                                                    <TableCell>
                                                        {formatCurrency(item.debtCreated)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatCurrency(item.debtPayment)}
                                                    </TableCell>
                                                    <TableCell>{formatCurrency(item.balance)}</TableCell>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>

                        <Card>
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">
                                Payroll Breakdown
                            </h3>

                            <div className="mb-4">
                                <TextInput
                                    label="Filter by Employee"
                                    type="text"
                                    value={employeeFilter}
                                    onChange={(e) => setEmployeeFilter(e.target.value)}
                                    placeholder="Enter employee name..."
                                />
                            </div>

                            {(() => {
                                const filtered = dashboard.payrollBreakdown.items.filter((item) =>
                                    item.employeeName
                                        .toLowerCase()
                                        .includes(employeeFilter.toLowerCase())
                                );
                                return filtered.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                        {dashboard.payrollBreakdown.items.length === 0
                                            ? "No payroll records found."
                                            : "No matching employees."}
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-slate-50 text-left text-slate-600">
                                                <tr>
                                                    <TableHeader>Employee</TableHeader>
                                                    <TableHeader>Earned</TableHeader>
                                                    <TableHeader>Paid</TableHeader>
                                                    <TableHeader>Balance</TableHeader>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtered.map((item) => (
                                                    <tr
                                                        key={item.employeeId}
                                                        className="border-t border-slate-200"
                                                    >
                                                        <TableCell>{item.employeeName}</TableCell>
                                                        <TableCell>
                                                            {formatCurrency(item.earned)}
                                                        </TableCell>
                                                        <TableCell>{formatCurrency(item.paid)}</TableCell>
                                                        <TableCell>{formatCurrency(item.owed)}</TableCell>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })()}
                        </Card>
                    </div>
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
        <Card className="p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
        </Card>
    );
}

type TableHeaderProps = {
    children: React.ReactNode;
};

function TableHeader({ children }: TableHeaderProps) {
    return <th className="px-4 py-3 font-medium">{children}</th>;
}

type TableCellProps = {
    children: React.ReactNode;
};

function TableCell({ children }: TableCellProps) {
    return <td className="px-4 py-3 text-slate-700">{children}</td>;
}
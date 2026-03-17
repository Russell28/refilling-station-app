import { useState } from "react"; // User Input 
import { apiClient } from "../api/client";

type DailySummary = {
  date: string;
  tripCount: number;
  totalCollectedQty: number;
  totalLoadedQty: number;
  totalDeliveredQty: number;
  totalFreeQty: number;
  totalToBePaidQty: number;
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

export default function DailySummaryPage() {
    const [selectedDate, setSelectedDate] = useState(getTodayLocalDate()); // Initialize with today's date
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<DailySummary | null>(null);

    const handleLoadSummary = async () => {
        if (!selectedDate) {
            setError("Please select a date.");
            setSummary(null);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await apiClient.get(
                `/daily-summary?date=${selectedDate}`
            );

            setSummary(response.data);
        } catch (error) {
            setError("Failed to load daily summary.");
            setSummary(null);
        } finally {
            setLoading(false);
        }

        console.log("Loading summary for date:", selectedDate);

        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    return (
        <section>
            <h2>Daily Summary</h2>

            <div style={{ marginTop: "16px" }}>
                <label htmlFor="summary-date">Select Date</label>
                <br />
                <input
                    id="summary-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <div style={{ marginTop: "12px" }}>
                <button onClick={handleLoadSummary} disabled={loading}>
                    {loading ? "Loading..." : "Load Summary"}
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {summary && (
                <div style={{ marginTop: "24px" }}>
                    <p>Date: {summary.date}</p>
                    <p>Trip Count: {summary.tripCount}</p>
                    <p>Total Collected Qty: {summary.totalCollectedQty}</p>
                    <p>Total Loaded Qty: {summary.totalLoadedQty}</p>
                    <p>Total Delivered Qty: {summary.totalDeliveredQty}</p>
                    <p>Total Free Qty: {summary.totalFreeQty}</p>
                    <p>Total To Be Paid Qty: {summary.totalToBePaidQty}</p>
                    <p>Total Actual Paid Qty: {summary.totalActualPaidQty}</p>
                    <p>Total Returned Qty: {summary.totalReturnedQty}</p>
                    <p>Total Replacement Qty: {summary.totalReplacementQty}</p>
                    <p>Total Cash Collected: {summary.totalCashCollected}</p>
                    <p>Total Expenses: {summary.totalExpenses}</p>
                    <p>Total Payroll Paid: {summary.totalPayrollPaid}</p>
                    <p>Total Debt Created Today: {summary.totalDebtCreatedToday}</p>
                    <p>Total Debt Payments Today: {summary.totalDebtPaymentsToday}</p>
                    <p>Outstanding Debt: {summary.outstandingDebt}</p>
                    <p>Net Cash Flow: {summary.netCashFlow}</p>
                </div>
            )}


        </section>
    )
}
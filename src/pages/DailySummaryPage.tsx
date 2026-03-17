import { useState } from "react"; // User Input 

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

    const handleLoadSummary = () => {
        setLoading(true);
        setError("");

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
        </section>
    )
}
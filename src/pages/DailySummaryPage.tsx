import { useState } from "react"; // User Input 

function getTodayLocalDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}



export default function DailySummaryPage() {
    const [selectedDate, setSelectedDate] = useState(getTodayLocalDate()); // Initialize with today's date

    const handleLoadSummary = () => {
        console.log("Loading summary for date:", selectedDate);
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
                <button onClick={handleLoadSummary}>Load Summary</button>
            </div>

        </section>
    )
}
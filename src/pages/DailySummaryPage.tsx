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

            <p style={{ marginTop: "12px" }}>
                You selected: <strong>{selectedDate}</strong>
            </p>

        </section>
    )
}
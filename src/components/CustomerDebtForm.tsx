
export default function CustomerDebtForm() {
    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Date</label>
                <input type="date" />
            </div>

            <div>
                <label>Customer Name</label>
                <input type="text" />
            </div>

            <div>
                <label>Qty</label>
                <input type="number" />
            </div>

            <div>
                <label>Amount</label>
                <input type="number" />
            </div>

            <div>
                <label>Notes</label>
                <input type="text" />
            </div>

            <div style={{ marginTop: 12 }}>
                <button type="submit">Save</button>
            </div>
        </form>
    );
}
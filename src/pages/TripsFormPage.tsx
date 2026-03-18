import { useParams, useNavigate } from "react-router-dom";
export default function TripsFormPage() {
    const { id } = useParams(); // For future use when editing existing trip
    const navigate = useNavigate();

    const isEditMode = !!id;

    function handleCancel() {
        navigate("/trips");
    }

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault(); // Prevent default form submission behavior like page reload

        if (isEditMode) {
            console.log("Submitting edit for trip ID:", id);
        } else {
            console.log("Submitting new trip");
        }
    }

    return (
        <div>
            <h1>{isEditMode ? "Edit Trip" : "New Trip"}</h1>

            <form onSubmit={handleSubmit}>
                {/* Trip Details */}

                <div>
                    <label>Date</label>
                    <input type="date" />
                </div>

                <div>
                    <label>Trip Number</label>
                    <input type="number" />
                </div>

                <div>
                    <label>Segment</label>
                    <input type="text" />
                </div>

                <div>
                    <label>Source</label>
                    <input type="text" />
                </div>

                <div>
                    <label>Trip Type</label>
                    <input type="text" />
                </div>

                <div>
                    <label>Employee Name</label>
                    <input type="text" />
                </div>

                <div>
                    <label>Customer Category</label>
                    <input type="text" />
                </div>

                {/* Time */}

                <div>
                    <label>Time Started</label>
                    <input type="time" />
                </div>

                <div>
                    <label>Time Ended</label>
                    <input type="time" />
                </div>

                {/* Quantities */}

                <div>
                    <label>Collected Qty</label>
                    <input type="number" />
                </div>

                <div>
                    <label>Loaded Qty</label>
                    <input type="number" />
                </div>

                <div>
                    <label>Delivered Qty</label>
                    <input type="number" />
                </div>

                <div>
                    <label>Free Qty</label>
                    <input type="number" />
                </div>

                <div>
                    <label>To Be Paid Qty</label>
                    <input type="number" />
                </div>

                <div>
                    <label>Actual Paid Qty</label>
                    <input type="number" />
                </div>

                <div>
                    <label>Returned Qty</label>
                    <input type="number" />
                </div>

                <div>
                    <label>Replacement Qty</label>
                    <input type="number" />
                </div>

                {/* Buttons */}

                <div style={{ marginTop: 20 }}>
                    <button type="submit">
                        {isEditMode ? "Update" : "Save"}
                    </button>

                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>

    );
}
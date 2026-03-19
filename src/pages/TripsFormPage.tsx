import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { type TripFormValues, emptyTripForm } from "../types/TripFormValues";

export default function TripsFormPage() {
    const { id } = useParams(); // For future use when editing existing trip
    const navigate = useNavigate();
    const [form, setForm] = useState<TripFormValues>(emptyTripForm); // Start with empty form for "create" mode

    const isEditMode = !!id;

    function handleCancel() {
        navigate("/trips");
    }

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault(); // Prevent default form submission behavior like page reload

        if (isEditMode) {
            console.log("Submitting edit for trip ID:", id);
            navigate("/trips");
        } else {
            console.log("Submitting new trip");
            navigate("/trips");
        }
    }

    function handleTextChange(
        e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value })); // Update the specific field that changed
    }

    function handleNumberChange(
        e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        const numericValue = parseFloat(value);
        setForm((prev) => ({ ...prev, [name]: isNaN(numericValue) ? 0 : numericValue })); // Update the specific field that changed, default to 0 if invalid
    }

    return (
        <div>
            <h1>{isEditMode ? "Edit Trip" : "New Trip"}</h1>

            <form onSubmit={handleSubmit}>
                {/* Trip Details */}

                <div>
                    <label>Date</label>
                    <input type="date" 
                    name="date"
                    value={form.date}
                    onChange={handleTextChange}
                    />
                </div>

                <div>
                    <label>Trip Number</label>
                    <input type="number" 
                    name="tripNumber"
                    value={form.tripNumber}
                    onChange={handleNumberChange}
                    />
                </div>

                <div>
                    <label>Segment</label>
                    <input type="text" 
                    name="segment"
                    value={form.segment}
                    onChange={handleTextChange}
                    />
                </div>

                <div>
                    <label>Source</label>
                    <input type="text" 
                    name="source"
                    value={form.source}
                    onChange={handleTextChange}
                    />
                </div>

                <div>
                    <label>Trip Type</label>
                    <input type="text" 
                    name="tripType"
                    value={form.tripType}
                    onChange={handleTextChange}
                    />
                </div>

                <div>
                    <label>Employee Name</label>
                    <input type="text" 
                    name="employeeName"
                    value={form.employeeName}
                    onChange={handleTextChange}
                    />
                </div>

                <div>
                    <label>Customer Category</label>
                    <input type="text" 
                    name="customerCategory"
                    value={form.customerCategory}
                    onChange={handleTextChange}
                    />
                </div>

                {/* Time */}

                <div>
                    <label>Time Started</label>
                    <input type="time" 
                    name="timeStarted"
                    value={form.timeStarted}
                    onChange={handleTextChange}
                    />
                </div>

                <div>
                    <label>Time Ended</label>
                    <input type="time" 
                    name="timeEnded"
                    value={form.timeEnded}
                    onChange={handleTextChange}
                    />
                </div>

                {/* Quantities */}

                <div>
                    <label>Collected Qty</label>
                    <input type="number" 
                    name="collectedQty"
                    value={form.collectedQty}
                    onChange={handleNumberChange}
                    />
                </div>

                <div>
                    <label>Loaded Qty</label>
                    <input type="number" 
                    name="loadedQty"
                    value={form.loadedQty}
                    onChange={handleNumberChange}
                    />
                </div>

                <div>
                    <label>Delivered Qty</label>
                    <input type="number" 
                    name="deliveredQty"
                    value={form.deliveredQty}
                    onChange={handleNumberChange}
                    />
                </div>

                <div>
                    <label>Free Qty</label>
                    <input type="number" 
                    name="freeQty"
                    value={form.freeQty}
                    onChange={handleNumberChange}
                    />
                </div>

                <div>
                    <label>To Be Paid Qty</label>
                    <input type="number" 
                    name="toBePaidQty"
                    value={form.toBePaidQty}
                    onChange={handleNumberChange}
                    />
                </div>

                <div>
                    <label>Actual Paid Qty</label>
                    <input type="number" 
                    name="actualPaidQty"
                    value={form.actualPaidQty}
                    onChange={handleNumberChange}
                    />
                </div>

                <div>
                    <label>Returned Qty</label>
                    <input type="number" 
                    name="returnedQty"
                    value={form.returnedQty}
                    onChange={handleNumberChange}
                    />
                </div>

                <div>
                    <label>Replacement Qty</label>
                    <input type="number" 
                    name="replacementQty"
                    value={form.replacementQty}
                    onChange={handleNumberChange}
                    />
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
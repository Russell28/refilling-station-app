import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type TripFormValues, emptyTripForm } from "./Trip";
import { createTrip, getTripById, updateTrip } from "./tripsApi";
import { formatDateForInput, formatTimeForInput } from "../../utils/date";

export default function TripsFormPage() {
    const { id } = useParams(); // detect if we have an "id" param in the URL
    const navigate = useNavigate();
    const [form, setForm] = useState<TripFormValues>(emptyTripForm); // Start with empty form for "create" mode

    const isEditMode = !!id; // If "id" exists, we're in edit mode. If no "id", we're in create mode.
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isEditMode) return;
        setLoading(true); // Start loading when we know we need to fetch data
        // Fetch the existing trip data by ID and populate the form
        async function loadTrip() {
            try {
                const data = await getTripById(Number(id));
                setForm({
                    date: formatDateForInput(data.date),
                    tripNumber: data.tripNumber ?? 0,
                    segment: data.segment ?? "",
                    source: data.source ?? "",
                    tripType: data.tripType ?? "",
                    employeeName: data.employeeName ?? "",
                    customerCategory: data.customerCategory ?? "",
                    timeStarted: formatTimeForInput(data.timeStarted),
                    timeEnded: formatTimeForInput(data.timeEnded),
                    collectedQty: data.collectedQty ?? 0,
                    loadedQty: data.loadedQty ?? 0,
                    deliveredQty: data.deliveredQty ?? 0,
                    freeQty: data.freeQty ?? 0,
                    toBePaidQty: data.toBePaidQty ?? 0,
                    actualPaidQty: data.actualPaidQty ?? 0,
                    actualCashCollected: data.actualCashCollected ?? 0,
                    returnedQty: data.returnedQty ?? 0,
                    replacementQty: data.replacementQty ?? 0,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadTrip();

    }, [id, isEditMode]); // Run when "id" or "isEditMode" changes (initial load or if id changes)

    function handleCancel() {
        navigate("/trips");
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault(); // Prevent default form submission behavior like page reload
        try {
            setSaving(true);
            setError(""); // Clear previous errors

            if (isEditMode) {
                await updateTrip(Number(id), form);
                navigate("/trips");
            } else {
                await createTrip(form);
                navigate("/trips");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while saving the trip. Please try again.");
        } finally {
            setSaving(false);
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

    if (loading) {
        return <p>Loading trip...</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }
    if (saving) {
        return <p>Saving trip...</p>;
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

                {/* Payment */}
                <div>
                    <label>Actual Cash Collected</label>
                    <input type="number"
                        name="actualCashCollected"
                        value={form.actualCashCollected}
                        onChange={handleNumberChange}
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
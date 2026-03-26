import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type TripFormValues, emptyTripForm } from "./Trip";
import { createTrip, getTripById, updateTrip } from "./tripsApi";
import { formatDateForInput, formatTimeForInput } from "../../utils/date";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";

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
                    timeStarted: formatTimeForInput(data.timeStarted),
                    timeEnded: formatTimeForInput(data.timeEnded),
                    employeeName: data.employeeName ?? "",
                    source: data.source ?? "",
                    tripType: data.tripType ?? "",
                    customerCategory: data.customerCategory ?? "",
                    
                    collectedQty: data.collectedQty ?? 0,
                    loadedQty: data.loadedQty ?? 0,
                    deliveredQty: data.deliveredQty ?? 0,
                    freeQty: data.freeQty ?? 0,
                    returnedQty: data.returnedQty ?? 0,
                    replacementQty: data.replacementQty ?? 0,

                    actualCashCollected: data.actualCashCollected ?? 0,

                    notes: data.notes ?? "",
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
            } else {
                await createTrip(form);
            }
            navigate("/trips");
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

    return (
        <div className="space-y-4">
            <PageHeader
                title={isEditMode ? "Edit Trip" : "New Trip"}
                description="Fill in trip, quantity, and payment details."
            />

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <p className="text-sm text-red-700">{error}</p>
                </Card>
            )}

            {loading && (
                <Card>
                    <p className="text-sm text-slate-500">Loading trip...</p>
                </Card>
            )}

            {saving && (
                <Card>
                    <p className="text-sm text-slate-500">Saving trip...</p>
                </Card>
            )}

            {!loading && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card>
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Trip Details
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <TextInput
                                label="Date"
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleTextChange}
                            />

                            <TextInput
                                label="Trip Number"
                                type="number"
                                name="tripNumber"
                                value={form.tripNumber}
                                onChange={handleNumberChange}
                            />

                            <TextInput
                                label="Employee Name"
                                type="text"
                                name="employeeName"
                                value={form.employeeName}
                                onChange={handleTextChange}
                            />

                            <TextInput
                                label="Source"
                                type="text"
                                name="source"
                                value={form.source}
                                onChange={handleTextChange}
                            />

                            <TextInput
                                label="Trip Type"
                                type="text"
                                name="tripType"
                                value={form.tripType}
                                onChange={handleTextChange}
                            />

                            <TextInput
                                label="Customer Category"
                                type="text"
                                name="customerCategory"
                                value={form.customerCategory}
                                onChange={handleTextChange}
                            />
                        </div>
                    </Card>

                    <Card>
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Quantities
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <TextInput
                                label="Collected Qty"
                                type="number"
                                name="collectedQty"
                                value={form.collectedQty}
                                onChange={handleNumberChange}
                            />

                            <TextInput
                                label="Loaded Qty"
                                type="number"
                                name="loadedQty"
                                value={form.loadedQty}
                                onChange={handleNumberChange}
                            />

                            <TextInput
                                label="Delivered Qty"
                                type="number"
                                name="deliveredQty"
                                value={form.deliveredQty}
                                onChange={handleNumberChange}
                            />

                            <TextInput
                                label="Free Qty"
                                type="number"
                                name="freeQty"
                                value={form.freeQty}
                                onChange={handleNumberChange}
                            />

                            <TextInput
                                label="Returned Qty"
                                type="number"
                                name="returnedQty"
                                value={form.returnedQty}
                                onChange={handleNumberChange}
                            />

                            <TextInput
                                label="Replacement Qty"
                                type="number"
                                name="replacementQty"
                                value={form.replacementQty}
                                onChange={handleNumberChange}
                            />
                        </div>
                    </Card>

                    <Card>
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Payment and Time
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <TextInput
                                label="Actual Cash Collected"
                                type="number"
                                name="actualCashCollected"
                                value={form.actualCashCollected}
                                onChange={handleNumberChange}
                            />

                            <TextInput
                                label="Time Started"
                                type="time"
                                name="timeStarted"
                                value={form.timeStarted}
                                onChange={handleTextChange}
                            />

                            <TextInput
                                label="Time Ended"
                                type="time"
                                name="timeEnded"
                                value={form.timeEnded}
                                onChange={handleTextChange}
                            />

                            <TextInput
                                label="Notes"
                                type="text"
                                name="notes"
                                value={form.notes ?? ""}
                                onChange={handleTextChange}
                            />
                        </div>
                    </Card>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>

                        <Button type="submit">
                            {isEditMode ? "Update" : "Save"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
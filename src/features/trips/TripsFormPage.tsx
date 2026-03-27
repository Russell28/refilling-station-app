import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type {
    Trip,
    TripFormValues,
    CreateTripRequest,
    UpdateTripRequest,
    TripFormErrors,
} from "./Trip";
import { emptyTripForm } from "./Trip";
import { createTrip, getTripById, updateTrip } from "./tripsApi";
import { formatDateForInput, formatTimeForInput } from "../../utils/date";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import normalizeServerErrors from "../../utils/normalizeServerErrors"

type ServerErrors = Partial<Record<keyof TripFormValues, string[]>>;

export default function TripsFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<TripFormValues>(emptyTripForm);
    const [errors, setErrors] = useState<TripFormErrors>({});
    const [serverErrors, setServerErrors] = useState<ServerErrors>({});

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isEditMode) return;

        setLoading(true);

        async function loadTrip() {
            try {
                const data = await getTripById(Number(id));
                setForm(mapTripToFormValues(data));
                setErrors({});
                setServerErrors({});
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load trip.");
            } finally {
                setLoading(false);
            }
        }

        loadTrip();
    }, [id, isEditMode]);

    function mapTripToFormValues(trip: Trip): TripFormValues {
        return {
            date: formatDateForInput(trip.date),
            tripNumber: trip.tripNumber.toString(),
            timeStarted: formatTimeForInput(trip.timeStarted),
            timeEnded: formatTimeForInput(trip.timeEnded),

            employeeName: trip.employeeName ?? "",
            source: trip.source ?? "",
            tripType: trip.tripType ?? "",
            customerCategory: trip.customerCategory ?? "",

            collectedQty: trip.collectedQty.toString(),
            loadedQty: trip.loadedQty.toString(),
            deliveredQty: trip.deliveredQty.toString(),
            freeQty: trip.freeQty.toString(),
            returnedQty: trip.returnedQty.toString(),
            replacementQty: trip.replacementQty.toString(),

            actualCashCollected: trip.actualCashCollected.toString(),
            isRemitted: trip.isRemitted ?? false,
            notes: trip.notes ?? "",
        };
    }

    function mapFormToCreateRequest(values: TripFormValues): CreateTripRequest {
        return {
            date: values.date,
            tripNumber: Number(values.tripNumber),

            timeStarted: values.timeStarted || null,
            timeEnded: values.timeEnded || null,

            employeeName: values.employeeName.trim(),
            source: values.source.trim() || null,
            tripType: values.tripType.trim() || null,
            customerCategory: values.customerCategory.trim() || null,

            collectedQty: Number(values.collectedQty || 0),
            loadedQty: Number(values.loadedQty || 0),
            deliveredQty: Number(values.deliveredQty || 0),
            freeQty: Number(values.freeQty || 0),
            returnedQty: Number(values.returnedQty || 0),
            replacementQty: Number(values.replacementQty || 0),

            actualCashCollected: Number(values.actualCashCollected || 0),
            notes: values.notes.trim() || null,
        };
    }

    function mapFormToUpdateRequest(values: TripFormValues): UpdateTripRequest {
        return {
            date: values.date,
            tripNumber: Number(values.tripNumber),

            timeStarted: values.timeStarted || null,
            timeEnded: values.timeEnded || null,

            employeeName: values.employeeName.trim(),
            source: values.source.trim() || null,
            tripType: values.tripType.trim() || null,
            customerCategory: values.customerCategory.trim() || null,

            collectedQty: Number(values.collectedQty || 0),
            loadedQty: Number(values.loadedQty || 0),
            deliveredQty: Number(values.deliveredQty || 0),
            freeQty: Number(values.freeQty || 0),
            returnedQty: Number(values.returnedQty || 0),
            replacementQty: Number(values.replacementQty || 0),

            actualCashCollected: Number(values.actualCashCollected || 0),
            isRemitted: values.isRemitted,
            notes: values.notes.trim() || null,
        };
    }

    function validateTripForm(values: TripFormValues): TripFormErrors {
        const errors: TripFormErrors = {};

        if (!values.date.trim()) {
            errors.date = "Date is required.";
        }

        const tripNumber = Number(values.tripNumber);
        if (!values.tripNumber.trim()) {
            errors.tripNumber = "Trip number is required.";
        } else if (Number.isNaN(tripNumber) || tripNumber <= 0) {
            errors.tripNumber = "Trip number must be greater than 0.";
        }

        if (!values.employeeName.trim()) {
            errors.employeeName = "Employee name is required.";
        }

        const numericFields: Array<
            | "collectedQty"
            | "loadedQty"
            | "deliveredQty"
            | "freeQty"
            | "returnedQty"
            | "replacementQty"
            | "actualCashCollected"
        > = [
            "collectedQty",
            "loadedQty",
            "deliveredQty",
            "freeQty",
            "returnedQty",
            "replacementQty",
            "actualCashCollected",
        ];

        for (const field of numericFields) {
            const rawValue = values[field];

            if (!rawValue.trim()) {
                continue;
            }

            const parsedValue = Number(rawValue);

            if (Number.isNaN(parsedValue)) {
                errors[field] = "Must be a valid number.";
            } else if (parsedValue < 0) {
                errors[field] = "Cannot be negative.";
            }
        }

        if (values.timeStarted && values.timeEnded) {
            const started = new Date(`2000-01-01T${values.timeStarted}`);
            const ended = new Date(`2000-01-01T${values.timeEnded}`);

            if (ended < started) {
                errors.timeEnded =
                    "Time ended must be greater than or equal to time started.";
            }
        }

        return errors;
    }

    function getFieldError(field: keyof TripFormValues): string | undefined {
        if (errors[field]) {
            return errors[field];
        }

        const apiErrors = serverErrors[field];
        if (apiErrors && apiErrors.length > 0) {
            return apiErrors[0];
        }

        return undefined;
    }

    function handleCancel() {
        navigate("/trips");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError(null);
        setServerErrors({});

        const validationErrors = validateTripForm(form);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setSaving(true);

        try {
            if (isEditMode) {
                const request = mapFormToUpdateRequest(form);
                await updateTrip(Number(id), request);
            } else {
                const request = mapFormToCreateRequest(form);
                await createTrip(request);
            }

            navigate("/trips");
        } catch (err: any) {
            console.error(err);

            const responseErrors = err?.response?.data?.errors;
            if (err?.response?.status === 400 && responseErrors) {
                setServerErrors(normalizeServerErrors(responseErrors));
                return;
            }

            setError("An error occurred while saving the trip. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value, type } = e.target;
        const checked =
            e.target instanceof HTMLInputElement ? e.target.checked : false;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));

        setServerErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));

        setError(null);
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

            {!loading && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card>
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Trip Details
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <TextInput
                                    label="Date"
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("date") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("date")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Trip Number"
                                    type="number"
                                    name="tripNumber"
                                    value={form.tripNumber}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("tripNumber") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("tripNumber")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Employee Name"
                                    type="text"
                                    name="employeeName"
                                    value={form.employeeName}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("employeeName") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("employeeName")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Source"
                                    type="text"
                                    name="source"
                                    value={form.source}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("source") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("source")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Trip Type"
                                    type="text"
                                    name="tripType"
                                    value={form.tripType}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("tripType") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("tripType")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Customer Category"
                                    type="text"
                                    name="customerCategory"
                                    value={form.customerCategory}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("customerCategory") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("customerCategory")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Quantities
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <TextInput
                                    label="Collected Qty"
                                    type="number"
                                    name="collectedQty"
                                    value={form.collectedQty}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("collectedQty") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("collectedQty")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Loaded Qty"
                                    type="number"
                                    name="loadedQty"
                                    value={form.loadedQty}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("loadedQty") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("loadedQty")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Delivered Qty"
                                    type="number"
                                    name="deliveredQty"
                                    value={form.deliveredQty}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("deliveredQty") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("deliveredQty")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Free Qty"
                                    type="number"
                                    name="freeQty"
                                    value={form.freeQty}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("freeQty") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("freeQty")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Returned Qty"
                                    type="number"
                                    name="returnedQty"
                                    value={form.returnedQty}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("returnedQty") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("returnedQty")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Replacement Qty"
                                    type="number"
                                    name="replacementQty"
                                    value={form.replacementQty}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("replacementQty") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("replacementQty")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Payment and Time
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <TextInput
                                    label="Actual Cash Collected"
                                    type="number"
                                    name="actualCashCollected"
                                    value={form.actualCashCollected}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("actualCashCollected") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("actualCashCollected")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Time Started"
                                    type="time"
                                    name="timeStarted"
                                    value={form.timeStarted}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("timeStarted") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("timeStarted")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Time Ended"
                                    type="time"
                                    name="timeEnded"
                                    value={form.timeEnded}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("timeEnded") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("timeEnded")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <TextInput
                                    label="Notes"
                                    type="text"
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleInputChange}
                                />
                                {getFieldError("notes") && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {getFieldError("notes")}
                                    </p>
                                )}
                            </div>
                        </div>

                        {isEditMode && (
                            <div className="mt-4">
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        name="isRemitted"
                                        checked={form.isRemitted}
                                        onChange={handleInputChange}
                                    />
                                    Is Remitted
                                </label>
                            </div>
                        )}
                    </Card>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : isEditMode
                                ? "Update"
                                : "Save"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
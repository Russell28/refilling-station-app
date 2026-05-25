import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type {
    Trip,
    TripFormValues,
    CreateTripRequest,
    UpdateTripRequest,
} from "./Trip";
import { emptyTripForm } from "./Trip";
import { createTrip, getNextTripNumber, getTripById, updateTrip } from "./tripsApi";
import { formatDateForInput, formatTimeForInput } from "../../utils/date";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import Dropdown from "../../components/ui/Dropdown";
import { CUSTOMER_CATEGORIES } from "../constants/constants";
import { useEmployees } from "../employees/EmployeeContext";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";


export default function TripsFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<TripFormValues>(emptyTripForm);
    const [estimatedCash, setEstimatedCash] = useState(0);
    const { fieldErrors, generalErrors, applyErrors, clearErrors, setFieldErrors } = useFormErrors<TripFormValues>()

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const employees = useEmployees();
    

    useEffect(() => {
        if (!isEditMode) {
            loadNextTripNumber(form.date);
            return;
        }

        loadTrip();
    }, [id, isEditMode]);

    useEffect(() => {
        // Set employee ID when employees load and we're in create mode
        if (!isEditMode && employees.length > 0 && !form.employeeId) {
            setForm((prev) => ({
                ...prev,
                employeeId: employees[0].id.toString(),
            }));
        }
    }, [employees, isEditMode, form.employeeId]);

    useEffect(() => {
        computeEstimatedCash();
    }, [
        form.loadedQty,
        form.deliveredQty,
        form.freeQty,
        form.replacementQty,
        form.customerCategory,
    ]);

    async function loadTrip() {
        try {
            clearErrors();
            setLoading(true);

            const data = await getTripById(Number(id));
            setForm(mapTripToFormValues(data));
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    async function loadNextTripNumber(selectedDate?: string) {
        try {
            clearErrors();
            setLoading(true);

            const nextTripNumber = await getNextTripNumber(selectedDate);
            setForm((prev) => ({
                ...prev,
                tripNumber: nextTripNumber.toString(),
                employeeId: employees.length > 0 ? employees[0].id.toString() : "",
            }));
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setLoading(false);
        }
    }

    function mapTripToFormValues(trip: Trip): TripFormValues {
        return {
            date: formatDateForInput(trip.date),
            tripNumber: trip.tripNumber.toString(),
            timeStarted: formatTimeForInput(trip.timeStarted),
            timeEnded: formatTimeForInput(trip.timeEnded),

            employeeId: trip.employeeId.toString() ?? "",
            source: trip.source ?? "",
            tripType: trip.tripType ?? "",
            customerCategory: trip.customerCategory ?? "",

            collectedQty: numToStringOrBlank(trip.collectedQty),
            loadedQty: numToStringOrBlank(trip.loadedQty),
            deliveredQty: numToStringOrBlank(trip.deliveredQty),
            freeQty: numToStringOrBlank(trip.freeQty),
            returnedQty: numToStringOrBlank(trip.returnedQty),
            replacementQty: numToStringOrBlank(trip.replacementQty),

            actualCashCollected: numToStringOrBlank(trip.actualCashCollected),
            isRemitted: trip.isRemitted ?? false,
            notes: trip.notes ?? "",
        };
    }

    function numToStringOrBlank(value: number | null | undefined): string {
        if (!value || value === 0) return "";
        return value.toString();
    }

    function mapFormToCreateRequest(values: TripFormValues): CreateTripRequest {
        return {
            date: values.date,
            tripNumber: Number(values.tripNumber),

            timeStarted: values.timeStarted || null,
            timeEnded: values.timeEnded || null,

            employeeId: Number(values.employeeId),
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

            employeeId: Number(values.employeeId),
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

    function validate(values: TripFormValues) {
        const errors: Partial<Record<keyof TripFormValues, string[]>> = {}

        if (!values.date.trim()) {
            errors.date = ["Date is required."];
        }

        const tripNumber = Number(values.tripNumber);
        if (!values.tripNumber.trim()) {
            errors.tripNumber = ["Trip number is required."];
        } else if (Number.isNaN(tripNumber) || tripNumber <= 0) {
            errors.tripNumber = ["Trip number must be greater than 0."];
        }

        const employeeId = Number(values.employeeId);
        if (!values.employeeId.trim()) {
            errors.employeeId = ["Employee ID is required."];
        } else if (Number.isNaN(employeeId) || employeeId <= 0) {
            errors.employeeId = ["Employee ID must be a valid number."];
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
                errors[field] = ["Must be a valid number."];
            } else if (parsedValue < 0) {
                errors[field] = ["Cannot be negative."];
            }
        }

        if (values.timeStarted && values.timeEnded) {
            const started = new Date(`2000-01-01T${values.timeStarted}`);
            const ended = new Date(`2000-01-01T${values.timeEnded}`);

            if (ended < started) {
                errors.timeEnded =
                    ["Time ended must be greater than or equal to time started."];
            }
        }

        return errors;
    }

    function handleCancel() {
        navigate("/trips");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        clearErrors();
        const clientErrors = validate(form);

        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors);
            return;
        }

        try {
            setSaving(true);

            if (isEditMode) {
                const request = mapFormToUpdateRequest(form);
                await updateTrip(Number(id), request);
            } else {
                const request = mapFormToCreateRequest(form);
                await createTrip(request);
            }

            navigate("/trips");
        } catch (err) {
            applyErrors(err as ErrorResponse);
        } finally {
            setSaving(false);
        }
    }

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value, type } = e.target;
        const checked =
            e.target instanceof HTMLInputElement ? e.target.checked : false;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function computeEstimatedCash(): void {
        const loaded = Number(form.loadedQty) || 0;
        const delivered = Number(form.deliveredQty) || 0;
        const free = Number(form.freeQty) || 0;
        const replacement = Number(form.replacementQty) || 0;
        const customerCategory = form.customerCategory;

        let toBePaidQty = 0;
        if (loaded > 0 && delivered == 0) {
            toBePaidQty = loaded - free - replacement;
        } else if (delivered > 0) {
            toBePaidQty = delivered - free - replacement;
        }

        const categoryPrice = CUSTOMER_CATEGORIES.find(
            (cat) => cat.name === customerCategory
        )?.price ?? 0;

        const estimatedCash = toBePaidQty * categoryPrice;
        setEstimatedCash(estimatedCash);
    }

    return (
        <div className="space-y-4">
            {saving && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span className="text-white text-sm font-medium">Saving…</span>
                    </div>
                </div>
            )}

            <PageHeader
                title={isEditMode ? "Edit Trip" : "New Trip"}
                description="Fill in trip, quantity, and payment details."
            />

            {generalErrors.length > 0 && <ServerErrorAlert errors={generalErrors} />}

            {loading ? (
                <Card>
                    <p className="text-sm text-slate-500">Loading trip...</p>
                </Card>
            ) : (
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
                                    error={fieldErrors.date?.[0]}
                                />
                            </div>

                            <div>
                                <TextInput
                                    label="Trip Number"
                                    type="number"
                                    name="tripNumber"
                                    value={form.tripNumber}
                                    onChange={handleInputChange}
                                    error={fieldErrors.tripNumber?.[0]}
                                />
                            </div>

                            <div>
                                <Dropdown
                                    label="Employee"
                                    name="employeeId"
                                    options={employees}
                                    value={form.employeeId}
                                    valueField="id"
                                    onChange={handleInputChange}
                                    error={fieldErrors.employeeId?.[0]}
                                />
                            </div>

                            <div>
                                <Dropdown
                                    label="Customer Category"
                                    name="customerCategory"
                                    options={CUSTOMER_CATEGORIES}
                                    value={form.customerCategory}
                                    onChange={handleInputChange}
                                    error={fieldErrors.customerCategory?.[0]}
                                />
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
                                    error={fieldErrors.collectedQty?.[0]}
                                />
                            </div>

                            <div>
                                <TextInput
                                    label="Loaded Qty"
                                    type="number"
                                    name="loadedQty"
                                    value={form.loadedQty}
                                    onChange={handleInputChange}
                                    error={fieldErrors.loadedQty?.[0]}
                                />
                            </div>

                            <div>
                                <TextInput
                                    label="Delivered Qty"
                                    type="number"
                                    name="deliveredQty"
                                    value={form.deliveredQty}
                                    onChange={handleInputChange}
                                    error={fieldErrors.deliveredQty?.[0]}
                                />
                            </div>

                            <div>
                                <TextInput
                                    label="Free Qty"
                                    type="number"
                                    name="freeQty"
                                    value={form.freeQty}
                                    onChange={handleInputChange}
                                    error={fieldErrors.freeQty?.[0]}
                                />
                            </div>

                            <div>
                                <TextInput
                                    label="Returned Qty"
                                    type="number"
                                    name="returnedQty"
                                    value={form.returnedQty}
                                    onChange={handleInputChange}
                                    error={fieldErrors.returnedQty?.[0]}
                                />
                            </div>

                            <div>
                                <TextInput
                                    label="Replacement Qty"
                                    type="number"
                                    name="replacementQty"
                                    value={form.replacementQty}
                                    onChange={handleInputChange}
                                    error={fieldErrors.replacementQty?.[0]}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Payment
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <TextInput
                                    label="Actual Cash Collected"
                                    type="number"
                                    name="actualCashCollected"
                                    value={form.actualCashCollected}
                                    onChange={handleInputChange}
                                    error={fieldErrors.actualCashCollected?.[0]}
                                />
                            </div>

                            <div>
                                <TextInput
                                    label="Estimated Cash"
                                    type="number"
                                    name="estimatedCash"
                                    value={estimatedCash}
                                    disabled
                                />
                            </div>

                            <div>
                                <TextInput
                                    label="Notes"
                                    type="text"
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleInputChange}
                                />
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
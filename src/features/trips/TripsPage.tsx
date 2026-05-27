import { useEffect, useState, useRef } from "react";
import { deleteTrip, getTrips, searchTrips } from "./tripsApi";
import type { Trip } from "./Trip";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import { apiClient } from "../../api/client";
import { getToken, isAdmin } from "../auth/utils/authStorage";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";
import { getFirstDayOfCurrentWeek, getTodayDateOnly } from "../../utils/date";
import type { DateRangeSearchRequest } from "../../types/DateRangeRequest";
import TextInput from "../../components/ui/TextInput";

export default function TripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { generalErrors, applyErrors, clearErrors } = useFormErrors<Trip>()
  const [searchRequest, setSearchRequest] = useState<DateRangeSearchRequest>({
    startDate: getFirstDayOfCurrentWeek(),
    endDate: getTodayDateOnly(),
  });

  useEffect(() => {
    loadTrips();
  }, [searchRequest]);

  async function loadTrips() {
    try {
      clearErrors();
      setLoading(true);
      const tripsData = await searchTrips(searchRequest);
      setTrips(tripsData);
    } catch (err) {
      applyErrors(err as ErrorResponse);
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteClick(tripId: number) {
    const confirmed = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmed) {
      return;
    }
    try {
      clearErrors();
      setLoading(true);
      await deleteTrip(tripId);

      const trips = await getTrips();
      setTrips(trips);
    } catch (err) {
      applyErrors(err as ErrorResponse);
    } finally {
      setLoading(false);
    }
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${apiClient.defaults.baseURL}/trips/import`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await res.json();

      const trips = await getTrips();
      setTrips(trips);
      alert(`Imported ${data.insertedRows} rows`);
    } catch (err) {
      console.error(err);
      alert("Import failed");
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Trips"
        description="Track deliveries and collections."
        action={
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">

            {/* Top row: actions */}
            <div className="flex gap-2">
              {isAdmin() && (
                <Button
                  variant="secondary"
                  onClick={handleImportClick}
                >
                  Import CSV
                </Button>
              )}
              <Button onClick={() => navigate("/trips/new")}>
                New Trip
              </Button>
            </div>
          </div>
        }
      />

      {isAdmin() && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <TextInput
            label="Start Date"
            type="date"
            value={searchRequest.startDate}
            onChange={(e) =>
              setSearchRequest({ ...searchRequest, startDate: e.target.value })
            }
          />
          <TextInput
            label="End Date"
            type="date"
            value={searchRequest.endDate}
            onChange={(e) =>
              setSearchRequest({ ...searchRequest, endDate: e.target.value })
            }
          />
          {/* <Button onClick={loadTrips}>Apply</Button> */}
        </div>
      )}

      {/* hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {generalErrors.length > 0 && (
        <ServerErrorAlert errors={generalErrors} />
      )}

      <Card className="p-0">
        {loading ? (
          <div className="p-4">
            <p className="text-sm text-slate-500">Loading trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="p-4">
            <p className="text-sm text-slate-500">No trips yet.</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Trip #</th>
                    <th className="px-4 py-3 font-medium">Employee</th>
                    <th className="px-4 py-3 font-medium text-right">Collected</th>
                    <th className="px-4 py-3 font-medium text-right">Delivered</th>
                    <th className="px-4 py-3 font-medium text-right">Free Qty</th>
                    <th className="px-4 py-3 font-medium text-right">Actual Cash</th>
                    <th className="px-4 py-3 font-medium">Notes</th>

                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {trips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="border-t border-slate-200"
                    >
                      <td className="px-4 py-3">
                        {new Date(trip.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {trip.tripNumber || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {trip.employeeName || "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {trip.collectedQty}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {trip.deliveredQty}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {trip.freeQty}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ₱{trip.actualCashCollected.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {trip.notes || "-"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() =>
                              navigate(`/trips/${trip.id}/edit`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              onDeleteClick(trip.id)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-1 md:hidden">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        Trip #{trip.tripNumber}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(trip.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-base font-bold text-slate-900">
                      ₱{trip.actualCashCollected.toLocaleString()}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3 text-sm">
                    <div>
                      <span className="block text-xs text-slate-500">Employee</span>
                      <span className="font-medium text-slate-700">
                        {trip.employeeName || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Collected</span>
                      <span className="font-medium text-slate-700">
                        {trip.collectedQty}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Delivered</span>
                      <span className="font-medium text-slate-700">
                        {trip.deliveredQty}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Free</span>
                      <span className="font-medium text-slate-700">
                        {trip.freeQty}
                      </span>
                    </div>
                    {/* Notes only if present */}
                    {trip.notes && (
                      <div className="col-span-2">
                        <span className="block text-xs text-slate-500">Notes</span>
                        <span className="font-medium text-slate-700">{trip.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-3">
                    <Button
                      variant="primary"
                      className="rounded-md px-3 py-2 text-sm bg-green-600 text-white hover:bg-green-700"
                      onClick={() => navigate(`/trips/${trip.id}/edit`)}
                    >
                      <FaEdit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="danger"
                      className="rounded-md px-3 py-2 text-sm bg-red-600 text-white hover:bg-red-700"
                      onClick={() => onDeleteClick(trip.id)}
                    >
                      <FaTrash className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

          </>
        )}
      </Card>
    </div>
  );
}
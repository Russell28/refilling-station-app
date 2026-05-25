import { useEffect, useState, useRef } from "react";
import { deleteTrip, getTrips } from "./tripsApi";
import type { Trip } from "./Trip";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import { apiClient } from "../../api/client";
import { getToken, isAdmin } from "../auth/utils/authStorage";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useFormErrors } from "../../hooks/useFormErrors";
import type { ErrorResponse } from "../../types/ErrorResponse";
import { ServerErrorAlert } from "../../components/ui/ServerErrorAlert";

export default function TripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { generalErrors, applyErrors, clearErrors } = useFormErrors<Trip>()

  useEffect(() => {
    loadTrips();
  }, []); // [] run once on first load

  async function loadTrips() {
    try {
      clearErrors();
      setLoading(true);
      const tripsData = await getTrips();
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
        description="Track deliveries, quantities, and collections."
        action={
          <div className="flex gap-2">
            {isAdmin() && (
              <Button
                variant="secondary"
                onClick={handleImportClick}
              >
                Import CSV
              </Button>
            )}

            <Button
              onClick={() => navigate("/trips/new")}
            >
              New Trip
            </Button>

          </div>
        }
      />

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

            <div className="space-y-3 p-4 md:hidden">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">
                        Trip #{trip.tripNumber}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(trip.date).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="font-semibold text-slate-900">
                      ₱{trip.actualCashCollected.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-700">
                        Employee:
                      </span>{" "}
                      {trip.employeeName || "-"}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">
                        Collected:
                      </span>{" "}
                      {trip.collectedQty}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">
                        Delivered:
                      </span>{" "}
                      {trip.deliveredQty}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">
                        Free:
                      </span>{" "}
                      {trip.freeQty}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">
                        Notes:
                      </span>{" "}
                      {trip.notes || "-"}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="warning"
                      className="p-3 rounded-full bg-green-600 text-white flex items-center justify-center 
                                  hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400
                                  sm:p-2 sm:rounded-md"
                      onClick={() =>
                        navigate(`/trips/${trip.id}/edit`)
                      }
                    >
                      <FaEdit className="w-4 h-4 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="danger"
                      className="p-3 rounded-full bg-red-600 text-white flex items-center justify-center 
                                  hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400
                                  sm:p-2 sm:rounded-md"
                      onClick={() => onDeleteClick(trip.id)}
                    >
                      <FaTrashAlt className="w-4 h-4 sm:w-4 sm:h-4" />
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
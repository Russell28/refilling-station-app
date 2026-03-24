import { useEffect, useState, useRef } from "react";
import { deleteTrip, getTrips } from "./tripsApi";
import type { Trip } from "./Trip";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import { apiClient } from "../../api/client";

export default function TripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrips() {
      try {
        setLoading(true);
        const tripsData = await getTrips();
        setTrips(tripsData);
      } catch (err) {
        setError("Failed to load trips.");
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []); // [] run once on first load

  async function onDeleteClick(tripId: number) {
    const confirmed = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmed) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await deleteTrip(tripId);

      const trips = await getTrips();
      setTrips(trips);
    } catch (error) {
      setError("Failed to delete trip.");
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

            <Button
              variant="secondary"
              onClick={handleImportClick}
            >
              Import CSV
            </Button>

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

      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
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
                    <th className="px-4 py-3 font-medium text-right">Paid Qty</th>
                    <th className="px-4 py-3 font-medium text-right">Actual Cash</th>
                    <th className="px-4 py-3 font-medium">Notes</th>

                    {/* Uncomment if you want more columns in desktop table */}
                    {/* <th className="px-4 py-3 font-medium">Segment</th> */}
                    {/* <th className="px-4 py-3 font-medium">Source</th> */}
                    {/* <th className="px-4 py-3 font-medium">Trip Type</th> */}
                    {/* <th className="px-4 py-3 font-medium">Customer Category</th> */}
                    {/* <th className="px-4 py-3 font-medium text-right">Collected</th> */}
                    {/* <th className="px-4 py-3 font-medium text-right">Loaded</th> */}
                    {/* <th className="px-4 py-3 font-medium text-right">Free</th> */}
                    {/* <th className="px-4 py-3 font-medium text-right">Returned</th> */}
                    {/* <th className="px-4 py-3 font-medium text-right">Replacement</th> */}
                    {/* <th className="px-4 py-3 font-medium text-right">Estimated Cash</th> */}
                    {/* <th className="px-4 py-3 font-medium">Start</th> */}
                    {/* <th className="px-4 py-3 font-medium">End</th> */}

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
                        {`${trip.tripNumber}${trip.segment}`} 
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
                        {trip.actualPaidQty}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ₱{trip.actualCashCollected.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {trip.notes || "-"}
                      </td>

                      {/* Uncomment if you want more columns in desktop table */}
                      {/* <td className="px-4 py-3">{trip.segment || "-"}</td> */}
                      {/* <td className="px-4 py-3">{trip.source || "-"}</td> */}
                      {/* <td className="px-4 py-3">{trip.tripType || "-"}</td> */}
                      {/* <td className="px-4 py-3">{trip.customerCategory || "-"}</td> */}
                      {/* <td className="px-4 py-3 text-right">{trip.collectedQty}</td> */}
                      {/* <td className="px-4 py-3 text-right">{trip.loadedQty}</td> */}
                      {/* <td className="px-4 py-3 text-right">{trip.freeQty}</td> */}
                      {/* <td className="px-4 py-3 text-right">{trip.returnedQty}</td> */}
                      {/* <td className="px-4 py-3 text-right">{trip.replacementQty}</td> */}
                      {/* <td className="px-4 py-3 text-right">₱{trip.estimatedCash.toLocaleString()}</td> */}
                      {/* <td className="px-4 py-3">
                                                {trip.timeStarted
                                                    ? new Date(trip.timeStarted).toLocaleTimeString()
                                                    : "-"}
                                            </td> */}
                      {/* <td className="px-4 py-3">
                                                {trip.timeEnded
                                                    ? new Date(trip.timeEnded).toLocaleTimeString()
                                                    : "-"}
                                            </td> */}

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
                        Trip #{trip.tripNumber}{trip.segment}
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
                        Paid Qty:
                      </span>{" "}
                      {trip.actualPaidQty}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">
                        Notes:
                      </span>{" "}
                      {trip.notes || "-"}
                    </p>

                    {/* Mobile optional details */}
                    {/* <p><span className="font-medium text-slate-700">Segment:</span> {trip.segment || "-"}</p> */}
                    {/* <p><span className="font-medium text-slate-700">Source:</span> {trip.source || "-"}</p> */}
                    {/* <p><span className="font-medium text-slate-700">Type:</span> {trip.tripType || "-"}</p> */}
                    {/* <p><span className="font-medium text-slate-700">Category:</span> {trip.customerCategory || "-"}</p> */}
                    {/* <p><span className="font-medium text-slate-700">Collected:</span> {trip.collectedQty}</p> */}
                    {/* <p><span className="font-medium text-slate-700">Loaded:</span> {trip.loadedQty}</p> */}
                    {/* <p><span className="font-medium text-slate-700">Free:</span> {trip.freeQty}</p> */}
                    {/* <p><span className="font-medium text-slate-700">Returned:</span> {trip.returnedQty}</p> */}
                    {/* <p><span className="font-medium text-slate-700">Replacement:</span> {trip.replacementQty}</p> */}
                    {/* <p><span className="font-medium text-slate-700">Estimated Cash:</span> ₱{trip.estimatedCash.toLocaleString()}</p> */}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() =>
                        navigate(`/trips/${trip.id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="flex-1"
                      onClick={() => onDeleteClick(trip.id)}
                    >
                      Delete
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
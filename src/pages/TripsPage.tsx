import { useEffect, useState } from "react";
import { getTrips } from "../api/tripsApi";
import type { Trip } from "../types/Trip";

export default function TripsPage() {
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

  return (
    <section>
      <h2>Trips</h2>
      {loading && <p>Loading trips...</p>}
      {error && <p>{error}</p>}

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th colSpan={9} style={{ textAlign: "center" }}>Trip Info</th>
            <th colSpan={6} style={{ textAlign: "center" }}>Quantities</th>
            <th colSpan={4} style={{ textAlign: "center" }}>Payments</th>
          </tr>
          <tr style={{ backgroundColor: "#fafafa" }}>
            {/* Trip Info */}
            <th>Date</th>
            <th>Trip #</th>
            {/* <th>Segment</th>
            <th>Employee</th>
            <th>Source</th>
            <th>Type</th> */}
            {/* <th>Start</th>
            <th>End</th> */}

            {/* Quantities */}
            <th style={{ textAlign: "right" }}>Collected</th>
            <th style={{ textAlign: "right" }}>Loaded</th>
            <th style={{ textAlign: "right" }}>Delivered</th>
            <th style={{ textAlign: "right" }}>Free</th>
            <th style={{ textAlign: "right" }}>Returned</th>
            <th style={{ textAlign: "right" }}>Replacement</th>

            {/* Payments */}
            <th style={{ textAlign: "right" }}>To Be Paid</th>
            <th style={{ textAlign: "right" }}>Paid Qty</th>
            <th style={{ textAlign: "right" }}>Estimated Cash</th>
            <th style={{ textAlign: "right" }}>Actual Cash</th>
            <th>Notes</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              {/* Trip Info */}
              <td>{new Date(trip.date).toLocaleDateString()}</td>
              <td>{trip.tripNumber}</td>
              {/* <td>{trip.segment}</td>
              <td>{trip.employeeName}</td>
              <td>{trip.source}</td>
              <td>{trip.tripType}</td> */}
              {/* <td>
                {trip.timeStarted
                  ? new Date(trip.timeStarted).toLocaleTimeString()
                  : "-"}
              </td>
              <td>
                {trip.timeEnded
                  ? new Date(trip.timeEnded).toLocaleTimeString()
                  : "-"}
              </td> */}

              {/* Quantities */}
              <td style={{ textAlign: "right" }}>{trip.collectedQty}</td>
              <td style={{ textAlign: "right" }}>{trip.loadedQty}</td>
              <td style={{ textAlign: "right" }}>{trip.deliveredQty}</td>
              <td style={{ textAlign: "right" }}>{trip.freeQty}</td>
              <td style={{ textAlign: "right" }}>{trip.returnedQty}</td>
              <td style={{ textAlign: "right" }}>{trip.replacementQty}</td>

              {/* Payments */}
              <td style={{ textAlign: "right" }}>{trip.toBePaidQty}</td>
              <td style={{ textAlign: "right" }}>{trip.actualPaidQty}</td>
              <td style={{ textAlign: "right" }}>
                {trip.estimatedCash.toFixed(2)}
              </td>
              <td style={{ textAlign: "right" }}>
                {trip.actualCashCollected.toFixed(2)}
              </td>
              <td>{trip.notes || "-"}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
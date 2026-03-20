import { apiClient } from "./client";
import type { Trip } from "../types/Trip";
import type { TripFormValues } from "../types/TripFormValues";

export async function getTrips(): Promise<Trip[]> {
    const response = await apiClient.get("/trips");
    return response.data;
}

export async function getTripById(id: number): Promise<Trip> {
    const response = await apiClient.get(`/trips/${id}`);
    return response.data;
}

export async function createTrip(payload: TripFormValues): Promise<Trip> {
    const apiPayload = {
        ...payload,
        date: payload.date ? new Date(payload.date).toISOString() : null,
        timeStarted: payload.timeStarted
            ? new Date(`1970-01-01T${payload.timeStarted}:00`).toISOString()
            : null,
        timeEnded: payload.timeEnded
            ? new Date(`1970-01-01T${payload.timeEnded}:00`).toISOString()
            : null,
    };

    const response = await apiClient.post("/trips", apiPayload);
    return response.data;
}

export async function updateTrip(id: number, payload: TripFormValues): Promise<Trip> {
    const apiPayload = {
        ...payload,
        date: payload.date ? new Date(payload.date).toISOString() : null,
        timeStarted: payload.timeStarted
            ? new Date(`1970-01-01T${payload.timeStarted}:00`).toISOString()
            : null,
        timeEnded: payload.timeEnded
            ? new Date(`1970-01-01T${payload.timeEnded}:00`).toISOString()
            : null,
    };

    const response = await apiClient.put(`/trips/${id}`, apiPayload);
    return response.data;
}

export async function deleteTrip(id: number): Promise<void> {
    await apiClient.delete(`/trips/${id}`);
}
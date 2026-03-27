import { apiClient } from "../../api/client";
import type { CreateTripRequest, Trip, UpdateTripRequest } from "./Trip";

export async function getTrips(): Promise<Trip[]> {
    const response = await apiClient.get("/trips");
    return response.data;
}

export async function getTripById(id: number): Promise<Trip> {
    const response = await apiClient.get(`/trips/${id}`);
    return response.data;
}

export async function createTrip(payload: CreateTripRequest): Promise<Trip> {
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

export async function updateTrip(id: number, payload: UpdateTripRequest): Promise<Trip> {
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
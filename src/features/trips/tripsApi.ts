import { apiClient } from "../../api/client";
import type { DateRangeSearchRequest } from "../../types/DateRangeRequest";
import type { CreateTripRequest, Trip, UpdateTripRequest } from "./Trip";

export async function getTrips(): Promise<Trip[]> {
    const response = await apiClient.get("/trips");
    return response.data;
}

export async function searchTrips(searchParams: DateRangeSearchRequest): Promise<Trip[]> {
    const response = await apiClient.post("/trips/search", searchParams);
    return response.data;
}

export async function getTripById(id: number): Promise<Trip> {
    const response = await apiClient.get(`/trips/${id}`);
    return response.data;
}

export async function createTrip(payload: CreateTripRequest): Promise<Trip> {
    const apiPayload = {
        ...payload,
        date: payload.date 
            ? new Date(payload.date).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
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
        date: payload.date 
            ? new Date(payload.date).toISOString().split("T")[0] // Convert to DateOnly format (YYYY-MM-DD)
            : null,
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

export async function getNextTripNumber(date?:string): Promise<number> {
    const targetDate = date ?? new Date().toISOString().split("T")[0];
    const response = await apiClient.get(`/trips/next-trip-number/${targetDate}`);
    return response.data.nextTripNo;
}
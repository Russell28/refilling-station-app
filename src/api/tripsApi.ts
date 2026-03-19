import { apiClient } from "./client";
import type { Trip } from "../types/Trip";

export async function getTrips() : Promise<Trip[]> {
    const response = await apiClient.get("/trips");
    return response.data;
}

export async function getTripById(id: number) : Promise<Trip> {
    const response = await apiClient.get(`/trips/${id}`);
    return response.data;
}
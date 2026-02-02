import api from "./client";
import type { Park, ParkCreate } from "../types";

export async function getParks(): Promise<Park[]> {
  const { data } = await api.get<Park[]>("/parks/");
  return data;
}

export async function getPark(id: number): Promise<Park> {
  const { data } = await api.get<Park>(`/parks/${id}`);
  return data;
}

export async function createPark(payload: ParkCreate): Promise<Park> {
  const { data } = await api.post<Park>("/parks/", payload);
  return data;
}

export async function updatePark(id: number, payload: Partial<ParkCreate>): Promise<Park> {
  const { data } = await api.patch<Park>(`/parks/${id}`, payload);
  return data;
}

export async function deletePark(id: number): Promise<void> {
  await api.delete(`/parks/${id}`);
}

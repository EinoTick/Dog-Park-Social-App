import api from "./client";
import type { Dog, DogCreate, DogUpdate } from "../types";

export async function getMyDogs(): Promise<Dog[]> {
  const { data } = await api.get<Dog[]>("/dogs/");
  return data;
}

export async function getDog(id: number): Promise<Dog> {
  const { data } = await api.get<Dog>(`/dogs/${id}`);
  return data;
}

export async function createDog(payload: DogCreate): Promise<Dog> {
  const { data } = await api.post<Dog>("/dogs/", payload);
  return data;
}

export async function updateDog(id: number, payload: DogUpdate): Promise<Dog> {
  const { data } = await api.patch<Dog>(`/dogs/${id}`, payload);
  return data;
}

export async function deleteDog(id: number): Promise<void> {
  await api.delete(`/dogs/${id}`);
}

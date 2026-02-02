import api from "./client";
import type { Visit, VisitCreate, VisitDetail, DashboardStats } from "../types";

export async function getVisits(params?: {
  park_id?: number;
  upcoming?: boolean;
}): Promise<VisitDetail[]> {
  const { data } = await api.get<VisitDetail[]>("/visits/", { params });
  return data;
}

export async function getMyVisits(): Promise<Visit[]> {
  const { data } = await api.get<Visit[]>("/visits/my");
  return data;
}

export async function getVisit(id: number): Promise<VisitDetail> {
  const { data } = await api.get<VisitDetail>(`/visits/${id}`);
  return data;
}

export async function createVisit(payload: VisitCreate): Promise<Visit> {
  const { data } = await api.post<Visit>("/visits/", payload);
  return data;
}

export async function updateVisit(
  id: number,
  payload: Partial<VisitCreate>
): Promise<Visit> {
  const { data } = await api.patch<Visit>(`/visits/${id}`, payload);
  return data;
}

export async function deleteVisit(id: number): Promise<void> {
  await api.delete(`/visits/${id}`);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/visits/dashboard-stats");
  return data;
}

export async function getUpcomingActivity(): Promise<VisitDetail[]> {
  const { data } = await api.get<VisitDetail[]>("/visits/upcoming-activity");
  return data;
}

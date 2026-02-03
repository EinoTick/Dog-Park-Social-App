import api from "./client";
import type { User } from "../types";

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: { full_name?: string; email?: string }): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.post("/users/me/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
}

// --- Admin ---

export interface AdminUserCreatePayload {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  is_admin?: boolean;
  is_active?: boolean;
}

export interface AdminUserUpdatePayload {
  full_name?: string;
  email?: string;
  is_active?: boolean;
  is_admin?: boolean;
}

export async function listUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/users/");
  return data;
}

export async function createUser(payload: AdminUserCreatePayload): Promise<User> {
  const { data } = await api.post<User>("/users/", payload);
  return data;
}

export async function updateUser(userId: number, payload: AdminUserUpdatePayload): Promise<User> {
  const { data } = await api.patch<User>(`/users/${userId}`, payload);
  return data;
}

export async function deleteUser(userId: number): Promise<void> {
  await api.delete(`/users/${userId}`);
}

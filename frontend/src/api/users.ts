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

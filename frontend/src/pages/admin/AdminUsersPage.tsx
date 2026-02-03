import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  type AdminUserCreatePayload,
  type AdminUserUpdatePayload,
} from "../../api/users";
import type { User } from "../../types";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: listUsers,
    enabled: !!user?.is_admin,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setShowCreate(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUserUpdatePayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setEditingUser(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  if (user && !user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload: AdminUserCreatePayload = {
      email: form.get("email") as string,
      username: form.get("username") as string,
      password: form.get("password") as string,
      full_name: (form.get("full_name") as string) || undefined,
      is_admin: form.get("is_admin") === "on",
      is_active: form.get("is_active") === "on",
    };
    createMutation.mutate(payload);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    const form = new FormData(e.currentTarget);
    const payload: AdminUserUpdatePayload = {
      full_name: (form.get("full_name") as string) || undefined,
      email: form.get("email") as string,
      is_active: form.get("is_active") === "on",
      is_admin: form.get("is_admin") === "on",
    };
    updateMutation.mutate({ id: editingUser.id, payload });
  };

  if (isLoading) return <span className="loading loading-spinner loading-lg" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "Add User"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="card bg-base-200 shadow p-4 space-y-3">
          <h2 className="font-semibold text-lg">New user</h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            required
          />
          <input
            name="username"
            placeholder="Username"
            className="input input-bordered w-full"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            required
          />
          <input name="full_name" placeholder="Full name" className="input input-bordered w-full" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" className="checkbox" defaultChecked />
            <span>Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_admin" className="checkbox" />
            <span>Admin</span>
          </label>
          <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
            {createMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Create"}
          </button>
        </form>
      )}

      {editingUser && (
        <form
          onSubmit={handleUpdate}
          className="card bg-base-200 shadow p-4 space-y-3"
        >
          <h2 className="font-semibold text-lg">Edit user: {editingUser.username}</h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            defaultValue={editingUser.email}
            required
          />
          <input
            name="full_name"
            placeholder="Full name"
            className="input input-bordered w-full"
            defaultValue={editingUser.full_name ?? ""}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              className="checkbox"
              defaultChecked={editingUser.is_active}
            />
            <span>Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_admin"
              className="checkbox"
              defaultChecked={editingUser.is_admin}
            />
            <span>Admin</span>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Save"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditingUser(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {users && users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Full name</th>
                <th>Active</th>
                <th>Admin</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium">{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.full_name ?? "—"}</td>
                  <td>{u.is_active ? "Yes" : "No"}</td>
                  <td>{u.is_admin ? "Yes" : "No"}</td>
                  <td className="text-base-content/70 text-sm">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditingUser(u)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        if (window.confirm(`Deactivate user "${u.username}"? They will not be able to log in.`)) {
                          deleteMutation.mutate(u.id);
                        }
                      }}
                      disabled={deleteMutation.isPending || !u.is_active}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-base-content/60">No users found.</p>
      )}
    </div>
  );
}

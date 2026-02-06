import { useState, useRef, useEffect } from "react";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setEditingUser(null);
    },
  });

  const editDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (editingUser) {
      editDialogRef.current?.showModal();
    } else {
      editDialogRef.current?.close();
    }
  }, [editingUser]);

  useEffect(() => {
    const dialog = editDialogRef.current;
    if (!dialog) return;
    const handleClose = () => setEditingUser(null);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

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
        <h1 className="text-3xl font-bold text-primary">Users</h1>
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
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="cursor-pointer hover:bg-base-300/30"
                  onClick={() => setEditingUser(u)}
                >
                  <td className="font-medium">{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.full_name ?? "—"}</td>
                  <td>{u.is_active ? "Yes" : "No"}</td>
                  <td>{u.is_admin ? "Yes" : "No"}</td>
                  <td className="text-base-content/70 text-sm">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-base-content/60">No users found.</p>
      )}

      <dialog ref={editDialogRef} className="modal">
        {editingUser && (
          <>
            <div className="modal-box">
              <h3 className="font-bold text-lg">Edit user: {editingUser.username}</h3>
              <form id="edit-user-form" onSubmit={handleUpdate} className="space-y-3 mt-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Email</span></label>
                  <input
                    name="email"
                    type="email"
                    className="input input-bordered w-full"
                    defaultValue={editingUser.email}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Full name</span></label>
                  <input
                    name="full_name"
                    className="input input-bordered w-full"
                    defaultValue={editingUser.full_name ?? ""}
                  />
                </div>
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
              </form>
              <div className="modal-action flex-wrap gap-2 justify-between mt-6">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-error"
                    onClick={() => {
                      if (window.confirm(`Delete user "${editingUser.username}"? This cannot be undone.`)) {
                        deleteMutation.mutate(editingUser.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Delete"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-ghost" onClick={() => setEditingUser(null)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="edit-user-form"
                    className="btn btn-primary"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? <span className="loading loading-spinner loading-sm" /> : "Save"}
                  </button>
                </div>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button type="submit" onClick={() => setEditingUser(null)}>close</button>
            </form>
          </>
        )}
      </dialog>
    </div>
  );
}

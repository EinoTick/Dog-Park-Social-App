import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { updateMe, changePassword } from "../../api/users";

export default function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pwMsg, setPwMsg] = useState("");

  // Profile form
  const { register: regProfile, handleSubmit: handleProfile } = useForm({
    defaultValues: { full_name: user?.full_name || "", email: user?.email || "" },
  });

  const profileMutation = useMutation({
    mutationFn: (data: { full_name?: string; email?: string }) => updateMe(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  // Password form
  const { register: regPw, handleSubmit: handlePw, reset: resetPw } = useForm<{
    current_password: string;
    new_password: string;
  }>();

  const pwMutation = useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) =>
      changePassword(data.current_password, data.new_password),
    onSuccess: () => {
      setPwMsg("Password changed successfully");
      resetPw();
    },
    onError: () => setPwMsg("Failed to change password. Check your current password."),
  });

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile */}
      <form onSubmit={handleProfile((d) => profileMutation.mutate(d))} className="space-y-3">
        <h2 className="text-xl font-semibold">Profile</h2>
        <div className="form-control">
          <label className="label"><span className="label-text">Full Name</span></label>
          <input className="input input-bordered w-full" {...regProfile("full_name")} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Email</span></label>
          <input type="email" className="input input-bordered w-full" {...regProfile("email")} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={profileMutation.isPending}>
          Save Profile
        </button>
      </form>

      <div className="divider" />

      {/* Change Password */}
      <form onSubmit={handlePw((d) => pwMutation.mutate(d))} className="space-y-3">
        <h2 className="text-xl font-semibold">Change Password</h2>
        {pwMsg && <div className="alert alert-info text-sm">{pwMsg}</div>}
        <div className="form-control">
          <label className="label"><span className="label-text">Current Password</span></label>
          <input type="password" className="input input-bordered w-full" {...regPw("current_password", { required: true })} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">New Password</span></label>
          <input type="password" className="input input-bordered w-full" {...regPw("new_password", { required: true, minLength: 6 })} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={pwMutation.isPending}>
          Change Password
        </button>
      </form>
    </div>
  );
}

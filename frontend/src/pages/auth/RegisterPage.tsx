import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../../api/auth";
import type { RegisterPayload } from "../../types";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<RegisterPayload>();

  const onSubmit = async (data: RegisterPayload) => {
    try {
      setError("");
      await registerUser(data);
      navigate("/login");
    } catch {
      setError("Registration failed. Email or username may already be taken.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center">Create Account</h2>

          {error && <div className="alert alert-error text-sm">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input
                type="email"
                className="input input-bordered w-full"
                {...register("email", { required: true })}
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Username</span></label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register("username", { required: true })}
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Full Name</span></label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register("full_name")}
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input
                type="password"
                className="input input-bordered w-full"
                {...register("password", { required: true, minLength: 6 })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : "Register"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

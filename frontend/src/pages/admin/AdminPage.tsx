import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();

  if (user && !user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Admin</h1>
      <p className="text-base-content/70">Manage the app and its users.</p>
      <div className="flex flex-wrap gap-4">
        <Link to="/admin/users" className="btn btn-primary">
          Manage Users
        </Link>
      </div>
    </div>
  );
}

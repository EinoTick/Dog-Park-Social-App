import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Dog Park Social
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/dogs">My Dogs</Link></li>
          <li><Link to="/parks">Parks</Link></li>
          <li><Link to="/visits">My Visits</Link></li>
          {user && (
            <li>
              <details>
                <summary>{user.username}</summary>
                <ul className="bg-base-200 rounded-t-none p-2 z-10">
                  <li><Link to="/settings">Settings</Link></li>
                  {user.is_admin && <li><Link to="/admin">Admin</Link></li>}
                  <li><button onClick={logout}>Logout</button></li>
                </ul>
              </details>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

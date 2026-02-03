import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 min-h-screen bg-base-200 shadow-sm flex flex-col">
      <div className="p-4 border-b border-base-300">
        <Link to="/" className="btn btn-ghost text-xl w-full justify-start px-2">
          Dog Park Social
        </Link>
      </div>
      <nav className="flex-1 p-2">
        <ul className="menu menu-vertical w-full gap-1">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/dogs">My Dogs</Link></li>
          <li><Link to="/parks">Parks</Link></li>
          <li><Link to="/visits">My Visits</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          {user?.is_admin && <li><Link to="/admin">Admin</Link></li>}
        </ul>
      </nav>
      <div className="p-2 border-t border-base-300">
        <button onClick={logout} className="btn btn-ghost w-full justify-start">
          Logout
        </button>
      </div>
    </aside>
  );
}

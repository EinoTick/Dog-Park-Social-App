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
        </ul>
      </nav>
      {user && (
        <div className="p-2 border-t border-base-300">
          <ul className="menu menu-vertical w-full">
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
          </ul>
        </div>
      )}
    </aside>
  );
}

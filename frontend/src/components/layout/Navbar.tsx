import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 min-h-screen bg-[#124d25] text-[#f0fdf4] font-semibold shadow-sm flex flex-col [&_a]:text-[#f0fdf4] [&_a:hover]:text-white [&_button]:text-[#f0fdf4] [&_button:hover]:text-white">
      <div className="p-4 border-b border-white/20 flex flex-col items-center gap-2">
        <Link to="/" className="flex flex-col items-center gap-2 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 56"
            className="w-12 h-12 shrink-0"
            fill="currentColor"
            aria-hidden
          >
            {/* Dog face — head */}
            <ellipse cx="32" cy="30" rx="18" ry="18" />
            {/* Ears */}
            <ellipse cx="14" cy="18" rx="9" ry="14" transform="rotate(-28 14 18)" />
            <ellipse cx="50" cy="18" rx="9" ry="14" transform="rotate(28 50 18)" />
            {/* Eyes */}
            <ellipse cx="26" cy="26" rx="4" ry="5" fill="currentColor" opacity="0.35" />
            <ellipse cx="38" cy="26" rx="4" ry="5" fill="currentColor" opacity="0.35" />
            {/* Nose */}
            <ellipse cx="32" cy="36" rx="5" ry="5.5" />
          </svg>
          <span className="text-xl text-center">Dog Park Social</span>
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
      <div className="p-2 border-t border-white/20">
        <button onClick={logout} className="btn btn-ghost w-full justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const iconClass = "w-5 h-5 shrink-0";
  return (
    <aside className="sidebar-viewport w-56 grid grid-rows-[auto_1fr_auto] min-h-0 shrink-0 overflow-hidden bg-[#124d25] text-[#f0fdf4] font-semibold shadow-sm [&_a]:text-[#f0fdf4] [&_a:hover]:text-white [&_button]:text-[#f0fdf4] [&_button:hover]:text-white">
      <div className="min-h-0 pt-4 pb-4 px-5 border-b border-white/20">
        <Link to="/" className="flex flex-col gap-2 w-full">
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 56"
              className="w-12 h-12 shrink-0"
              fill="currentColor"
              aria-hidden
            >
              <ellipse cx="32" cy="30" rx="18" ry="18" />
              <ellipse cx="14" cy="18" rx="9" ry="14" transform="rotate(-28 14 18)" />
              <ellipse cx="50" cy="18" rx="9" ry="14" transform="rotate(28 50 18)" />
              <ellipse cx="26" cy="26" rx="4" ry="5" fill="currentColor" opacity="0.35" />
              <ellipse cx="38" cy="26" rx="4" ry="5" fill="currentColor" opacity="0.35" />
              <ellipse cx="32" cy="36" rx="5" ry="5.5" />
            </svg>
          </div>
          <span className="text-xl text-center">Dog Park Social</span>
        </Link>
      </div>
      <nav className="min-h-0 overflow-y-auto overflow-x-hidden px-5 py-3">
        <ul className="menu menu-vertical w-full gap-1">
          <li>
            <Link to="/dashboard" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dogs" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-1.823.47-2.703 2.12-2 4 .22.72.626 1.2 1 1.5" />
                <path d="M12 12v.01" />
                <path d="M14 5.172c0-1.39 1.577-2.493 3.5-2.21 1.823.47 2.703 2.12 2 4-.22.72-.626 1.2-1 1.5" />
                <path d="M16 12v.01" />
                <path d="M15 15.5c-.5 1-1.5 2-3 2.5-1.5.5-2.5.5-3 0" />
                <path d="M9 15.5c.5 1 1.5 2 3 2.5 1.5.5 2.5.5 3 0" />
                <path d="M8 22a4 4 0 0 1 8 0" />
                <path d="M9.5 8.5c1 1 2 1 3 0" />
              </svg>
              My Dogs
            </Link>
          </li>
          <li>
            <Link to="/parks" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Parks
            </Link>
          </li>
          <li>
            <Link to="/visits" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              My Visits
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </Link>
          </li>
          {user?.is_admin && (
            <li>
              <Link to="/admin" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="min-h-0 px-5 py-3 border-t border-white/20">
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

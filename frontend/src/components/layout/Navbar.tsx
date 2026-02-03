import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type NavbarProps = {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

const LogoIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 56"
    className={`shrink-0 ${className}`}
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
);

export default function Navbar({ isOpen = true, onOpen, onClose }: NavbarProps) {
  const { user, logout } = useAuth();
  const iconClass = "w-5 h-5 shrink-0";
  const linkProps = { onClick: onClose };
  const textVisible = isOpen;
  const linkClassName = `flex items-center gap-2 ${textVisible ? "max-md:justify-start max-md:gap-2" : "max-md:justify-center max-md:gap-0"} md:justify-start md:gap-2`;

  return (
    <>
      {/* Backdrop — mobile only, when expanded */}
      <div
        role="presentation"
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-200 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`
          sidebar-viewport grid grid-rows-[auto_1fr_auto] min-h-0 shrink-0 overflow-hidden bg-[#124d25] text-[#f0fdf4] font-semibold shadow-sm
          [&_a]:text-[#f0fdf4] [&_a:hover]:text-white [&_button]:text-[#f0fdf4] [&_button:hover]:text-white
          md:relative inset-y-0 left-0 z-50 md:z-auto
          md:w-56 transition-[width] duration-200 ease-out
          ${isOpen ? "max-md:w-56" : ""}
        `}
      >
      <div className={`min-h-0 pt-4 pb-4 border-b border-white/20 relative px-3 md:px-5 ${isOpen ? "max-md:px-5" : ""}`}>
        {/* Logo as button to expand — mobile only when collapsed */}
        {onOpen && (
          <button
            type="button"
            className={`md:hidden w-full flex justify-center ${isOpen ? "max-md:hidden" : ""}`}
            onClick={onOpen}
            aria-label="Open menu"
          >
            <LogoIcon className="w-10 h-10" />
          </button>
        )}
        {/* Full logo + title + close — visible when expanded (mobile) or always on desktop */}
        <div className={`flex flex-col gap-2 w-full ${!isOpen ? "max-md:hidden" : ""} md:!block`}>
          {onClose && (
            <button
              type="button"
              className="md:hidden absolute top-2 right-2 btn btn-ghost btn-sm btn-square"
              onClick={onClose}
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <Link to="/" className="flex flex-col gap-2 w-full" {...linkProps}>
            <div className="flex justify-center">
              <LogoIcon />
            </div>
            <span className={`text-xl text-center hidden md:block ${textVisible ? "max-md:block" : ""}`}>
              Dog Park Social
            </span>
          </Link>
        </div>
      </div>
      <nav className={`min-h-0 overflow-y-auto overflow-x-hidden py-3 px-3 md:px-5 ${isOpen ? "max-md:px-5" : ""}`}>
        <ul className="menu menu-vertical w-full gap-1">
          <li>
            <Link to="/dashboard" className={linkClassName} {...linkProps}>
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              <span className={`hidden md:inline ${textVisible ? "max-md:inline" : ""}`}>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/dogs" className={linkClassName} {...linkProps}>
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
              <span className={`hidden md:inline ${textVisible ? "max-md:inline" : ""}`}>My Dogs</span>
            </Link>
          </li>
          <li>
            <Link to="/parks" className={linkClassName} {...linkProps}>
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className={`hidden md:inline ${textVisible ? "max-md:inline" : ""}`}>Parks</span>
            </Link>
          </li>
          <li>
            <Link to="/visits" className={linkClassName} {...linkProps}>
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span className={`hidden md:inline ${textVisible ? "max-md:inline" : ""}`}>My Visits</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className={linkClassName} {...linkProps}>
              <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className={`hidden md:inline ${textVisible ? "max-md:inline" : ""}`}>Settings</span>
            </Link>
          </li>
          {user?.is_admin && (
            <li>
              <Link to="/admin" className={linkClassName} {...linkProps}>
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className={`hidden md:inline ${textVisible ? "max-md:inline" : ""}`}>Admin</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div className={`min-h-0 py-3 px-3 md:px-5 border-t border-white/20 ${isOpen ? "max-md:px-5" : ""}`}>
        <button
          onClick={logout}
          className={`btn btn-ghost w-full gap-2 ${textVisible ? "max-md:justify-start max-md:gap-2" : "max-md:justify-center max-md:gap-0"} md:justify-center md:gap-2`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className={`hidden md:inline ${textVisible ? "max-md:inline" : ""}`}>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}

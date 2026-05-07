import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const NAV_LINKS = [
  { to: "/",         label: "Dashboard" },
  { to: "/projects", label: "Projects"  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/*  Left — logo + links*/}
        <div className="flex items-center gap-8">

         

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.to)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/*Right — user + logout */}
        <div className="flex items-center gap-3">

          {/* User pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {user?.name || "User"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getStoredUser } from "../../features/auth/utils/authStorage";

const navItems = [
    { to: "/", label: "Dashboard", adminOnly: true },
    { to: "/daily-summary", label: "Daily Summary" },
    { to: "/trips", label: "Trips" },
    { to: "/expenses", label: "Expenses" },
    { to: "/debt-entries", label: "Debts" },
    { to: "/payrolls", label: "Payrolls", adminOnly: true },
    { to: "/monthly-summary", label: "Monthly Summary", adminOnly: true },

];

export default function Navbar() {
    const navigate = useNavigate(); // Get navigate function for programmatic navigation
    const user = getStoredUser(); // Get current user info for display in navbar
    const isAdmin = user?.role === "Admin"; // Check if the user has admin role

    function handleLogout() {
        clearAuth(); // Clear auth info from localStorage
        navigate("/login"); // Redirect to login page after logout
    }

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                    <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900">
                        Water Refilling Station
                    </h1>
                    <p className="text-sm text-slate-500">
                        Operations App
                    </p>
                </div>

                <nav className="flex flex-wrap gap-2">
                    {navItems
                    .filter(item => !item.adminOnly || isAdmin)
                    .map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                                [
                                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                                ].join(" ")
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <span className="text-sm text-slate-500">
                            {user.username} ({user.role})
                        </span>
                    ) : null}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
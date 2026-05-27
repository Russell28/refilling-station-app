import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getStoredUser } from "../../features/auth/utils/authStorage";
import { FaBars, FaTimes } from "react-icons/fa";

const navItems = [
    { to: "/", label: "Dashboard", adminOnly: true },
    { to: "/daily-summary", label: "Daily Summary" },
    { to: "/trips", label: "Trips" },
    { to: "/customers", label: "Customers" },
    { to: "/expenses", label: "Expenses" },
    { to: "/customer-debts", label: "Debts" },
    { to: "/payrolls", label: "Payrolls", adminOnly: true },
    { to: "/monthly-summary", label: "Monthly Summary", adminOnly: true },

];

export default function Navbar() {
    const isDev = import.meta.env.MODE === "development";
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const user = getStoredUser();
    const isAdmin = user?.role === "Admin";

    function handleLogout() {
        clearAuth();
        navigate("/login");
    }

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* Brand */}
                <div>
                    <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900">
                        Water Refilling Station
                    </h1>
                    {isDev && (
                        <span className="rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
                            DEV
                        </span>
                    )}
                    <p className="text-sm text-slate-500">Operations App</p>
                </div>

                {/* Desktop nav + user */}
                <div className="hidden md:flex items-center gap-6">
                    <nav className="flex gap-2">
                        {navItems
                            .filter((item) => !item.adminOnly || isAdmin)
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
                        {user && (
                            <span className="text-sm text-slate-500">
                                {user.username} ({user.role})
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Hamburger (mobile only) */}
                <button
                    className="md:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-200"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile nav */}
            {open && (
                <nav className="md:hidden flex flex-col gap-2 px-4 pb-4">
                    {navItems
                        .filter((item) => !item.adminOnly || isAdmin)
                        .map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === "/"}
                                onClick={() => setOpen(false)}
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

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                    >
                        Logout
                    </button>
                </nav>
            )}
        </header>
    );
}


import { NavLink } from "react-router-dom";

const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/trips", label: "Trips" },
    { to: "/debt-entries", label: "Customer Debts" },
    { to: "/expenses", label: "Expenses" },
    { to: "/payrolls", label: "Payrolls" },
    { to: "/daily-summary", label: "Daily Summary" },

];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">
                        Water Refilling Station
                    </h1>
                    <p className="text-sm text-slate-500">Operations App</p>
                </div>

                <nav className="flex flex-wrap gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) =>
                                [
                                    "rounded-lg px-3 py-2 text-sm font-medium transition",
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
            </div>
        </header>
    );
}
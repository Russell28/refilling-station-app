import { isAuthenticated, getStoredUser } from "../utils/authStorage";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const user = getStoredUser();

    // Redirect non-admin users to daily summary page
    if (!user || user.role !== "Admin") {
        return <Navigate to="/daily-summary" replace />;
    }

    return <Outlet />;
}
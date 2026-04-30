import type { RouteObject } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

// Feature pages
import DashboardPage from "../features/dashboard/DashboardPage";
import DailySummaryPage from "../features/daily-summary/DailySummaryPage";
import TripsPage from "../features/trips/TripsPage";
import TripsFormPageWithProvider from "../features/trips/TripsFormPageWithProvider";
import CustomerDebtPage from "../features/customer-debts/CustomerDebtPage";
import CustomersPage from "../features/customers/CustomersPage";
import ExpensesPageWithProvider from "../features/expenses/ExpensesPageWithProvider";
import PayrollsPage from "../features/payrolls/PayrollsPage";
import MonthlySummaryPage from "../features/monthly-summary/MonthlySummaryPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import AdminRoute from "../features/auth/components/AdminRoute";

export const routes: RouteObject[] = [
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        element: <ProtectedRoute />, // Redirects to login if not authenticated
        children: [
            {
                element: <AppLayout />, // Main layout for authenticated routes
                children: [
                    {
                        element: <AdminRoute />, // Only allows admin users to access these routes
                        children: [
                            { path: "/", element: <DashboardPage /> },
                            { path: "/payrolls", element: <PayrollsPage /> },
                            { path: "/monthly-summary", element: <MonthlySummaryPage /> },
                        ]
                    },
                    { path: "/daily-summary", element: <DailySummaryPage /> },
                    { path: "/trips", element: <TripsPage /> },
                    { path: "/trips/new", element: <TripsFormPageWithProvider /> },
                    { path: "/trips/:id/edit", element: <TripsFormPageWithProvider /> },
                    { path: "/customers", element: <CustomersPage /> },
                    { path: "/debt-entries", element: <CustomerDebtPage /> },
                    { path: "/expenses", element: <ExpensesPageWithProvider /> },
                ]
            }

        ],

    }
]

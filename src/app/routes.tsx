import type { RouteObject } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

// Feature pages
import DashboardPage from "../features/dashboard/DashboardPage";
import DailySummaryPage from "../features/daily-summary/DailySummaryPage";
import TripsPage from "../features/trips/TripsPage";
import TripsFormPage from "../features/trips/TripsFormPage";
import CustomerDebtPage from "../features/customer-debts/CustomerDebtPage";
import ExpensesPage from "../features/expenses/ExpensesPage";
import PayrollsPage from "../features/payrolls/PayrollsPage";
import MonthlySummaryPage from "../features/monthly-summary/MonthlySummaryPage";
import LoginPage from "../features/auth/pages/LoginPage";

export const routes: RouteObject[] = [
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        element: <AppLayout />, // persistent layout
        children: [
            { path: "/", element: <DashboardPage /> },
            { path: "/daily-summary", element: <DailySummaryPage /> },
            { path: "/trips", element: <TripsPage /> },
            { path: "/trips/new", element: <TripsFormPage /> },
            { path: "/trips/:id/edit", element: <TripsFormPage /> },
            { path: "/debt-entries", element: <CustomerDebtPage /> },
            { path: "/expenses", element: <ExpensesPage /> },
            { path: "/payrolls", element: <PayrollsPage /> },
            { path: "/monthly-summary", element: <MonthlySummaryPage /> },
        ],

    }
]

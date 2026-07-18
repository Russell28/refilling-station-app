import type { RouteObject } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

// Feature pages
import DashboardPage from "../features/reports/dashboard/DashboardPage";
import DailySummaryPage from "../features/reports/daily-summary/DailySummaryPage";
import TripsPage from "../features/trips/TripsPage";
import TripsFormPageWithProvider from "../features/trips/TripsFormPageWithProvider";
import CustomersPage from "../features/customers/CustomersPage";
import ExpensesPageWithProvider from "../features/expenses/ExpensesPageWithProvider";
import MonthlySummaryPage from "../features/reports/monthly-summary/MonthlySummaryPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import AdminRoute from "../features/auth/components/AdminRoute";
import CustomerDebtPageWithProvider from "../features/customer-debts/CustomerDebtPageWithProvider";
import PayrollsPageWithProvider from "../features/payrolls/payroll-entries/PayrollEntriesPageWithProvider";
import UsersPage from "../features/users/UsersPage";
import EmployeesPage from "../features/employees/EmployeesPage";

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
                            { path: "/users", element: <UsersPage /> },
                            { path: "/employees", element: <EmployeesPage /> },
                            { path: "/payrolls", element: <PayrollsPageWithProvider /> },
                            { path: "/monthly-summary", element: <MonthlySummaryPage /> },
                        ]
                    },
                    { path: "/daily-summary", element: <DailySummaryPage /> },
                    { path: "/trips", element: <TripsPage /> },
                    { path: "/trips/new", element: <TripsFormPageWithProvider /> },
                    { path: "/trips/:id/edit", element: <TripsFormPageWithProvider /> },
                    { path: "/customers", element: <CustomersPage /> },
                    { path: "/customer-debts", element: <CustomerDebtPageWithProvider /> },
                    { path: "/expenses", element: <ExpensesPageWithProvider /> },
                ]
            }

        ],

    }
]

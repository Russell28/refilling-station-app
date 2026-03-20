import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import DailySummaryPage from "./pages/DailySummaryPage";
import TripsPage from "./pages/TripsPage";
import TripsFormPage from "./pages/TripsFormPage";
import CustomerDebtPage from "./pages/CustomerDebtPage";
import ExpensesPage from "./features/expenses/ExpensesPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/daily-summary" element={<DailySummaryPage />} />
        {/* Trips */}
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/new" element={<TripsFormPage />} />
        <Route path="/trips/:id/edit" element={<TripsFormPage />} />
        <Route path="/debt-entries" element={<CustomerDebtPage />} />
        {/* Expenses */}
        <Route path="/expenses" element={<ExpensesPage />} />

      </Routes>
    </AppLayout>
  );
}
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import DailySummaryPage from "./pages/DailySummaryPage";
import TripsPage from "./pages/TripsPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/daily-summary" element={<DailySummaryPage />} />
        <Route path="/trips" element={<TripsPage />} />
      </Routes>
    </AppLayout>
  );
}
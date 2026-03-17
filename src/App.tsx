import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import DailySummaryPage from "./pages/DailySummaryPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/daily-summary" element={<DailySummaryPage />} />
      </Routes>
    </AppLayout>
  );
}
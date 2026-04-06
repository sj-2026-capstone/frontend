import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MonitoringPage from "./pages/MonitoringPage";
import InspectionDetailPage from "./pages/InspectionDetailPage";
import InspectionHistoryPage from "./pages/InspectionHistoryPage";
import AlertsPage from "./pages/AlertsPage";
import AiAnalysisPage from "./pages/AiAnalysisPage";
import AccountManagementPage from "./pages/AccountManagementPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/inspection/:id" element={<InspectionDetailPage />} />
            <Route path="/history" element={<InspectionHistoryPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/analysis" element={<AiAnalysisPage />} />
            <Route path="/accounts" element={<AccountManagementPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

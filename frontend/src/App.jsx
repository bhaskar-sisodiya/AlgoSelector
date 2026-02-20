// src/App.jsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate, // Added this to handle redirects
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRoute from "./utils/PublicRoute";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout"; // <--- IMPORT THE LAYOUT

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage"; // The main stats page

// Dashboard Sub-pages
import DatasetUpload from "./pages/dashboard/DatasetUpload";
import Preprocessing from "./pages/dashboard/Preprocessing";
import MetaInsights from "./pages/dashboard/MetaInsights";
import Explainability from "./pages/dashboard/Explainability";
import Monitoring from "./pages/dashboard/Monitoring";
import AlgorithmSelection from "./pages/dashboard/AlgorithmSelection";

const queryClient = new QueryClient();

// Helper Wrappers (These are fine!)
const LandingWrapper = () => {
  const navigate = useNavigate();
  return <LandingPage onNavigateToAuth={() => navigate("/auth")} />;
};

const AuthWrapper = () => {
  const navigate = useNavigate();
  return (
    <AuthPage
      onBack={() => navigate("/")}
      onLoginSuccess={() => navigate("/dashboard")}
    />
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingWrapper />
                </PublicRoute>
              }
            />

            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthWrapper />
                </PublicRoute>
              }
            />

            {/* PROTECTED DASHBOARD ROUTES */}
            {/* We wrap everything in DashboardLayout so Sidebar persists */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* 🔥 Default route changed */}
              <Route index element={<Navigate to="upload" replace />} />

              <Route path="upload" element={<DatasetUpload />} />
              <Route path="preprocessing" element={<Preprocessing />} />
              <Route path="insights" element={<MetaInsights />} />
              <Route path="explainability" element={<Explainability />} />
              <Route path="monitoring" element={<Monitoring />} />
              <Route path="algorithms" element={<AlgorithmSelection />} />
            </Route>

            {/* Fallback for 404s */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

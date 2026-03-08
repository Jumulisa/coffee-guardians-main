import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { GlobalErrorBanner } from "@/components/GlobalErrorBanner";
import ProtectedRoute from "@/components/ProtectedRoute";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Protected Pages
import Index from "./pages/Index";
import UploadPage from "./pages/UploadPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import DiseasesPage from "./pages/DiseasesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />}
        />
        <Route
          path="/forgot-password"
          element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
        />

        {/* Protected Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/diseases" element={<DiseasesPage />} />
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <GlobalErrorBanner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

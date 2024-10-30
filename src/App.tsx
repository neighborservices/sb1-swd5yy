import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useOnboarding } from './hooks/useOnboarding';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StaffAssignment from './pages/StaffAssignment';
import DailyAssignment from './pages/DailyAssignment';
import Rooms from './pages/Rooms';
import Account from './pages/Account';
import Reports from './pages/Reports';
import Onboarding from './pages/Onboarding';
import SignIn from './pages/SignIn';
import TipPayment from './pages/TipPayment';

function AppRoutes() {
  const { isOnboarded, isAuthenticated, isLoading } = useOnboarding();

  // Handle loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Special case for tip payment page - it should be accessible without auth
  const isTipPaymentRoute = window.location.pathname.startsWith('/tip/');
  if (isTipPaymentRoute) {
    return (
      <Routes>
        <Route path="/tip/:roomId" element={<TipPayment />} />
      </Routes>
    );
  }

  // Not authenticated - show sign in or onboarding
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/onboarding/*" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  // Authenticated but not onboarded - show onboarding
  if (!isOnboarded) {
    return (
      <Routes>
        <Route path="/onboarding/*" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // Fully authenticated and onboarded - show main app
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/staff-assignment" element={<StaffAssignment />} />
          <Route path="/daily-assignment" element={<DailyAssignment />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/account" element={<Account />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/tip/:roomId" element={<TipPayment />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
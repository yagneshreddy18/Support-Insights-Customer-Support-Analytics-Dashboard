import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

import { DashboardPage } from './pages/DashboardPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { AllTicketsPage } from './pages/AllTicketsPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ManageUsersPage } from './pages/ManageUsersPage';
import { ManageCategoriesPage } from './pages/ManageCategoriesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role_name)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Authenticated Dashboard Pages */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tickets/new" element={<CreateTicketPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Staff & Admin Routes */}
        <Route
          path="/all-tickets"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Support Agent']}>
              <AllTicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Support Agent']}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-only Routes */}
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-categories"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <ManageCategoriesPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

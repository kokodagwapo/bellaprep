import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Prep4LoanModule from '../modules/prep4loan/Prep4LoanModule';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import DashboardModule from '../modules/dashboard/DashboardModule';
import AnalyticsModule from '../modules/analytics/AnalyticsModule';
import ProductMatrixModule from '../modules/products/ProductMatrixModule';
import FormBuilderModule from '../modules/forms/FormBuilderModule';
import SettingsModule from '../modules/settings/SettingsModule';
import IntegrationsModule from '../modules/integrations/IntegrationsModule';
import QrCenterModule from '../modules/qr/QrCenterModule';
import AuditModule from '../modules/audit/AuditModule';
import NotificationsModule from '../modules/notifications/NotificationsModule';
import CalendarModule from '../modules/calendar/CalendarModule';
import PlaidModule from '../modules/plaid/PlaidModule';
import UserManagementModule from '../modules/users/UserManagementModule';
import TenantManagementModule from '../modules/tenants/TenantManagementModule';
import BellaOrbitModule from '../modules/bella/BellaOrbitModule';
import NotFound from './NotFound';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage';
import { AuthProvider } from '../contexts/AuthContext';
import { TenantProvider } from '../contexts/TenantContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <TenantProvider>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/borrower" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Borrower flow - public for now */}
          <Route path="/borrower/*" element={<Prep4LoanModule />} />
          
          {/* Protected workspace routes */}
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <WorkspaceLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardModule />} />
            <Route path="analytics" element={<AnalyticsModule />} />
            <Route path="products" element={<ProductMatrixModule />} />
            <Route path="forms" element={<FormBuilderModule />} />
            <Route path="settings" element={<SettingsModule />} />
            <Route path="integrations" element={<IntegrationsModule />} />
            <Route path="qr" element={<QrCenterModule />} />
            <Route path="audit" element={<AuditModule />} />
            <Route path="notifications" element={<NotificationsModule />} />
            <Route path="calendar" element={<CalendarModule />} />
            <Route path="plaid" element={<PlaidModule />} />
            <Route path="users" element={<UserManagementModule />} />
            <Route path="tenants" element={<TenantManagementModule />} />
            <Route path="bella" element={<BellaOrbitModule />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </TenantProvider>
  );
};

export default App;

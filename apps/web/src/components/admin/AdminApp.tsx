import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { DashboardPage } from './DashboardPage';
import { OrganizationPage } from './OrganizationPage';
import { UsersPage } from './UsersPage';
import { ProductsPage } from './ProductsPage';
import { IntegrationsPage } from './IntegrationsPage';
import { QRCenterPage } from './QRCenterPage';
import { SecurityPage } from './SecurityPage';
import { FormBuilderPage } from './FormBuilderPage';
import { AuditLogPage } from './AuditLogPage';
import { AnalyticsDashboard } from './AnalyticsDashboard';

interface AdminAppProps {
  initialPage?: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export const AdminApp: React.FC<AdminAppProps> = ({
  initialPage = 'dashboard',
  user = {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Lender Admin',
  },
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'organization':
        return <OrganizationPage />;
      case 'users':
        return <UsersPage />;
      case 'products':
        return <ProductsPage />;
      case 'forms':
        return <FormBuilderPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'qr':
        return <QRCenterPage />;
      case 'security':
        return <SecurityPage />;
      case 'audit':
        return <AuditLogPage />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <OrganizationPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      user={user}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminApp;


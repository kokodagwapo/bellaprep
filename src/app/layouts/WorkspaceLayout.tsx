import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Sidebar, SidebarBody, useSidebar } from '../../components/ui/sidebar';
import { Landmark, FilePlus2, FileText, AiIcon, LayoutList, Home } from '../../components/icons';
import { cn } from '../../lib/utils';

const workspaceNav = [
  { label: 'Dashboard', path: '/workspace/dashboard', icon: <Home className="h-5 w-5" /> },
  { label: 'Analytics', path: '/workspace/analytics', icon: <LayoutList className="h-5 w-5" /> },
  { label: 'Products', path: '/workspace/products', icon: <FilePlus2 className="h-5 w-5" /> },
  { label: 'Forms', path: '/workspace/forms', icon: <FileText className="h-5 w-5" /> },
  { label: 'Settings', path: '/workspace/settings', icon: <Landmark className="h-5 w-5" /> },
  { label: 'Integrations', path: '/workspace/integrations', icon: <AiIcon className="h-5 w-5" /> },
  { label: 'QR Center', path: '/workspace/qr', icon: <LayoutList className="h-5 w-5" /> },
  { label: 'Audit Logs', path: '/workspace/audit', icon: <LayoutList className="h-5 w-5" /> },
  { label: 'Notifications', path: '/workspace/notifications', icon: <LayoutList className="h-5 w-5" /> },
  { label: 'Calendar', path: '/workspace/calendar', icon: <LayoutList className="h-5 w-5" /> },
  { label: 'Plaid', path: '/workspace/plaid', icon: <LayoutList className="h-5 w-5" /> },
  { label: 'Users', path: '/workspace/users', icon: <LayoutList className="h-5 w-5" /> },
  { label: 'Tenants', path: '/workspace/tenants', icon: <LayoutList className="h-5 w-5" /> },
  { label: 'Bella Orbit', path: '/workspace/bella', icon: <AiIcon className="h-5 w-5" /> },
];

const SidebarNavLink: React.FC<{ label: string; path: string; icon: React.ReactNode }> = ({ label, path, icon }) => {
  const { open, animate } = useSidebar();
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 hover:bg-muted touch-manipulation',
          'md:px-3 md:py-2 md:rounded-lg',
          isActive ? 'bg-primary/10 text-primary' : 'text-foreground',
        )
      }
    >
      <span className="flex-shrink-0 text-foreground" style={{ color: '#000000' }}>
        {icon}
      </span>
      <span
        className={cn(
          'text-base md:text-lg font-light tracking-tight transition-opacity duration-150 whitespace-pre',
          animate ? (open ? 'opacity-100' : 'opacity-0 md:opacity-0') : 'opacity-100',
        )}
        style={{ color: '#000000' }}
      >
        {label}
      </span>
    </NavLink>
  );
};

const WorkspaceLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar>
        <SidebarBody
          className="justify-between gap-10 bg-white border-r border-border"
          style={{
            backgroundColor: '#ffffff',
            background: '#ffffff',
            color: '#000000',
            opacity: 1,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            filter: 'none',
          }}
        >
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mb-4 sm:mb-6 pt-3 sm:pt-4 flex flex-col items-center">
              <img
                src={`${import.meta.env.BASE_URL}TeraTrans.png`}
                alt="TERAVERDE Logo"
                className="w-auto h-auto max-w-[120px] sm:max-w-[140px] object-contain"
                style={{ maxHeight: '60px', width: 'auto', height: 'auto' }}
              />
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              {workspaceNav.map((link) => (
                <SidebarNavLink key={link.path} {...link} />
              ))}
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 shadow-sm bg-white">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">
                JD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Jane Doe</span>
                <span className="text-xs text-muted-foreground">Lender Admin</span>
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar bg-muted/40">
        <div className="h-full w-full px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default WorkspaceLayout;

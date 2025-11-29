import React from 'react';

const TenantManagementModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Tenant Manager</h1>
        <p className="mt-1 text-muted-foreground">
          SuperAdmins can onboard new lenders, monitor usage, and configure environment-wide policies.
        </p>
      </header>
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground">Tenant Directory</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Provisioning workflows, billing status, and tenant analytics will populate this table as the backend matures.
        </p>
      </section>
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground">Global Policies</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Define SOC-2 guardrails, audit retention rules, and integration defaults for all tenants.
        </p>
      </section>
    </div>
  );
};

export default TenantManagementModule;

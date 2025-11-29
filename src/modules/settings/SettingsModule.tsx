import React from 'react';

const SettingsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Organization Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Configure lender branding, users, and integrations. Detailed forms will be delivered as backend services come online.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">Branding & Logo</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Upload lender branding packages, configure themes, and map color palettes to borrower-facing flows.
          </p>
        </section>
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">API Keys & Webhooks</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage system credentials securely. Serverless endpoints and audit logging will enforce rotation policies.
          </p>
        </section>
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">Users & Roles</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Administer loan officers, processors, underwriters, and closers with fine-grained permissions.
          </p>
        </section>
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">Security & MFA</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Configure multi-factor authentication, WebAuthn devices, and biometric policies per tenant.
          </p>
        </section>
      </div>
    </div>
  );
};

export default SettingsModule;

import React from 'react';

const IntegrationsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Integrations</h1>
        <p className="mt-1 text-muted-foreground">
          Connect Plaid, calendar services, LOS/CRM, and communications. Secure credential vaulting will be powered by the backend.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">Plaid</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enable identity, balances, transactions, and income verification to auto-populate borrower assets.
          </p>
        </section>
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">Calendar</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Sync Google Workspace and Microsoft 365 calendars for consultations, disclosures, and closing milestones.
          </p>
        </section>
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">CRM / LOS</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Configure Encompass, Salesforce, and other LOS/CRM connectors. Webhook definitions will serialize audit events.
          </p>
        </section>
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">Messaging</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Manage SendGrid and Twilio credentials for borrower outreach, OTP delivery, and timeline reminders.
          </p>
        </section>
      </div>
    </div>
  );
};

export default IntegrationsModule;

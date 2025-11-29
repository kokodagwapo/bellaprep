import React from 'react';

const NotificationsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Notifications & Outreach</h1>
        <p className="mt-1 text-muted-foreground">
          Centralize borrower communications, document reminders, and Bella-triggered follow-ups.
        </p>
      </header>
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground">Channels</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Configure email, SMS, and in-app messaging powered by SendGrid and Twilio integrations.
        </p>
      </section>
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground">Automation</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Upcoming workflow engine will orchestrate borrower nudges and loan team alerts tied to audit events.
        </p>
      </section>
    </div>
  );
};

export default NotificationsModule;

import React from 'react';

const CalendarModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Calendar Sync</h1>
        <p className="mt-1 text-muted-foreground">
          Manage lender availability, borrower appointments, and automated reminders through Google and Microsoft integrations.
        </p>
      </header>
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground">Connected Calendars</h2>
        <p className="text-sm text-muted-foreground mt-2">
          OAuth flows and background sync jobs will surface soon to keep schedules aligned across teams.
        </p>
      </section>
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground">Automation</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Bella will schedule, reschedule, and remind borrowers about milestones using the notification engine.
        </p>
      </section>
    </div>
  );
};

export default CalendarModule;

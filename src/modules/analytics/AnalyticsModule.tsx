import React from 'react';

const AnalyticsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Analytics & Reporting</h1>
        <p className="mt-1 text-muted-foreground">
          Coming soon: lender pipeline, borrower funnel, Bella usage, and more.
        </p>
      </header>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">Borrower Funnel</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Visualizations for application progress, drop-off points, and conversion metrics will be powered by the analytics
            service once connected.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">Loan Officer Performance</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Metrics for task completion, Prep4Loan turnaround, and URLA fulfillment will surface here.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">Bella Orbit Engagement</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Track voice/chat usage, response quality, and automated follow-ups from the Bella assistant.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground">Integration Health</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor Plaid, calendar, CRM/LOS, and notification pipelines with real-time status indicators.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsModule;

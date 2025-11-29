import React from 'react';

const DashboardModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">BellaPrep Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          High-level overview for lender teams. Detailed widgets will arrive in upcoming iterations.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Borrower Pipeline</h2>
          <p className="mt-3 text-3xl font-semibold text-foreground">--</p>
          <p className="text-xs text-muted-foreground mt-1">Connect upcoming analytics services to populate.</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Prep4Loan Progress</h2>
          <p className="mt-3 text-3xl font-semibold text-foreground">--%</p>
          <p className="text-xs text-muted-foreground mt-1">Dynamic scoring pipeline will surface here.</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Action Items</h2>
          <p className="mt-3 text-3xl font-semibold text-foreground">0</p>
          <p className="text-xs text-muted-foreground mt-1">Task engine integration planned in subsequent milestones.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;

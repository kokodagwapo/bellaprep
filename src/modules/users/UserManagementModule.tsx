import React from 'react';

const UserManagementModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Users & Roles</h1>
        <p className="mt-1 text-muted-foreground">
          Invite loan officers, processors, underwriters, and closers. Assign role-based permissions across the platform.
        </p>
      </header>
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground">Role Directory</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Role templates and policy inheritance will surface here. Integration with the auth service will enforce RBAC.
        </p>
      </section>
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground">Activity Snapshot</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Link to audit events, onboarding status, and Bella usage for each team member.
        </p>
      </section>
    </div>
  );
};

export default UserManagementModule;

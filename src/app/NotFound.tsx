import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold text-foreground">Page not found</h1>
        <p className="text-muted-foreground">
          The page you were looking for doesn&apos;t exist. Please check the navigation or return to Prep4Loan.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          to="/borrower"
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow transition hover:bg-primary/90"
        >
          Back to Prep4Loan
        </Link>
        <Link
          to="/workspace/dashboard"
          className="rounded-lg border border-border px-4 py-2 text-foreground transition hover:bg-muted"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

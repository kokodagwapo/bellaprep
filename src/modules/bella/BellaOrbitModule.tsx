import React from 'react';

const BellaOrbitModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Bella Orbit Assistant</h1>
        <p className="mt-1 text-muted-foreground">
          Configure the floating voice/chat avatar experience, knowledge sources, and automation behaviors.
        </p>
      </header>
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground">Persona & Tone</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Customize prompts, fallback messaging, and underwriting explanations tailored to each lender brand.
        </p>
      </section>
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-foreground">Realtime Sessions</h2>
        <p className="text-sm text-muted-foreground mt-2">
          OpenAI Realtime hooks will power live conversations, knowledge search, and borrower coaching.
        </p>
      </section>
    </div>
  );
};

export default BellaOrbitModule;

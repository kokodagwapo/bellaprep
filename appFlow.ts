import React from 'react';
import { LoanPurpose } from './types';
import StepWelcome from './components/StepWelcome';
import StepLoanPurpose from './components/StepLoanPurpose';
import StepPropertyType from './components/StepPropertyType';
import StepPropertyUse from './components/StepPropertyUse';
import StepPricing from './components/StepPricing';
import StepRefinanceDetails from './components/StepRefinanceDetails';
import StepBorrowAmount from './components/StepBorrowAmount';
import StepCreditScore from './components/StepCreditScore';
import StepLocation from './components/StepLocation';
import StepFirstTimeBuyer from './components/StepFirstTimeBuyer';
import StepMilitary from './components/StepMilitary';
import StepPrepDocs from './components/StepPrepDocs';
import StepName from './components/StepName';
import StepContact from './components/StepContact';
import StepConfirmation from './components/StepConfirmation';

type StepComponent = React.ComponentType<any>;
type LoanPath = 'all' | LoanPurpose.PURCHASE | LoanPurpose.REFINANCE;

export interface AppStep {
  component: StepComponent;
  path: LoanPath;
  indicatorLabel?: string;
}

export const appFlow: AppStep[] = [
  { component: StepWelcome, path: 'all' },
  { component: StepLoanPurpose, path: 'all', indicatorLabel: 'Loan' },
  { component: StepPropertyType, path: 'all', indicatorLabel: 'Property' },
  { component: StepPropertyUse, path: 'all' },
  { component: StepCreditScore, path: 'all', indicatorLabel: 'Credit' },
  { component: StepPricing, path: LoanPurpose.PURCHASE, indicatorLabel: 'Price' },
  { component: StepRefinanceDetails, path: LoanPurpose.REFINANCE, indicatorLabel: 'Price' },
  { component: StepBorrowAmount, path: LoanPurpose.PURCHASE },
  { component: StepLocation, path: 'all', indicatorLabel: 'Location' },
  { component: StepFirstTimeBuyer, path: LoanPurpose.PURCHASE, indicatorLabel: 'Details' },
  { component: StepMilitary, path: 'all' },
  { component: StepPrepDocs, path: 'all', indicatorLabel: 'Docs' },
  { component: StepName, path: 'all', indicatorLabel: 'Contact' },
  { component: StepContact, path: 'all' },
  { component: StepConfirmation, path: 'all', indicatorLabel: 'Apply' },
];
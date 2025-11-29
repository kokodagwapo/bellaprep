import React from 'react';
import { LoanPurpose, PropertyUse } from './types';
import StepWelcome from './components/StepWelcome';
import StepLoanPurpose from './components/StepLoanPurpose';
import StepPropertyType from './components/StepPropertyType';
import StepPropertyUse from './components/StepPropertyUse';
import StepPrimaryResidenceConfirmation from './components/StepPrimaryResidenceConfirmation';
import StepSubjectProperty from './components/StepSubjectProperty';
import StepCurrentHousingStatus from './components/StepCurrentHousingStatus';
import StepEmploymentStatus from './components/StepEmploymentStatus';
import StepTimeInJob from './components/StepTimeInJob';
import StepDebtsLiabilities from './components/StepDebtsLiabilities';
import StepAssetsFunds from './components/StepAssetsFunds';
import StepAddCoBorrower from './components/StepAddCoBorrower';
import StepCoBorrowerDetails from './components/StepCoBorrowerDetails';
import StepPrimaryBorrowerOptimization from './components/StepPrimaryBorrowerOptimization';
import StepPrepDocs from './components/StepPrepDocs';
import StepDMVAddressVerification from './components/StepDMVAddressVerification';
import StepAffordabilitySnapshot from './components/StepAffordabilitySnapshot';
import StepReviewChecklist from './components/StepReviewChecklist';
import StepPrep4LoanSummary from './components/StepPrep4LoanSummary';
import StepCreditScore from './components/StepCreditScore';
import StepPricing from './components/StepPricing';
import StepRefinanceDetails from './components/StepRefinanceDetails';
import StepBorrowAmount from './components/StepBorrowAmount';
import StepLocation from './components/StepLocation';
import StepFirstTimeBuyer from './components/StepFirstTimeBuyer';
import StepMilitary from './components/StepMilitary';
import StepName from './components/StepName';
import StepContact from './components/StepContact';
import StepConfirmation from './components/StepConfirmation';
import type { FormData } from './types';

type StepComponent = React.ComponentType<any>;
type LoanPath = 'all' | LoanPurpose.PURCHASE | LoanPurpose.REFINANCE;

export interface AppStep {
  component: StepComponent;
  path: LoanPath;
  indicatorLabel?: string;
  condition?: (data: FormData) => boolean; // Conditional step visibility
}

// Helper function to filter flow based on conditions
export const getFilteredFlow = (flow: AppStep[], formData: FormData): AppStep[] => {
  return flow.filter(step => {
    if (step.path !== 'all' && step.path !== formData.loanPurpose) {
      return false;
    }
    if (step.condition && !step.condition(formData)) {
      return false;
    }
    return true;
  });
};

export const appFlow: AppStep[] = [
  { component: StepWelcome, path: 'all' },
  { component: StepLoanPurpose, path: 'all', indicatorLabel: 'Goal' },
  { component: StepPropertyType, path: 'all', indicatorLabel: 'Property' },
  { component: StepPropertyUse, path: 'all', indicatorLabel: 'Occupancy' },
  { 
    component: StepPrimaryResidenceConfirmation, 
    path: 'all',
    condition: (data) => data.propertyUse === PropertyUse.PRIMARY_RESIDENCE
  },
  { component: StepSubjectProperty, path: 'all', indicatorLabel: 'Property' },
  { component: StepCurrentHousingStatus, path: 'all', indicatorLabel: 'Housing' },
  { component: StepEmploymentStatus, path: 'all', indicatorLabel: 'Employment' },
  { component: StepTimeInJob, path: 'all', indicatorLabel: 'Employment' },
  { component: StepDebtsLiabilities, path: 'all', indicatorLabel: 'Debts' },
  { component: StepAssetsFunds, path: 'all', indicatorLabel: 'Assets' },
  { component: StepAddCoBorrower, path: 'all', indicatorLabel: 'Co-Borrower' },
  { 
    component: StepCoBorrowerDetails, 
    path: 'all',
    condition: (data) => data.coBorrower !== undefined && !!data.coBorrower
  },
  { 
    component: StepPrimaryBorrowerOptimization, 
    path: 'all',
    condition: (data) => data.coBorrower !== undefined && !!data.coBorrower
  },
  { component: StepPrepDocs, path: 'all', indicatorLabel: 'Docs' },
  { component: StepDMVAddressVerification, path: 'all', indicatorLabel: 'Verification' },
  { component: StepAffordabilitySnapshot, path: 'all', indicatorLabel: 'Snapshot' },
  { component: StepReviewChecklist, path: 'all', indicatorLabel: 'Review' },
  { component: StepPrep4LoanSummary, path: 'all', indicatorLabel: 'Summary' },
  { component: StepConfirmation, path: 'all', indicatorLabel: 'Apply' },
];
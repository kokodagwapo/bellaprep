import Step0LoanType from './Step0_LoanType';
import Step1BorrowerInfo from './Step1_BorrowerInfo';
import Step1bExtendedBorrowerInfo from './Step1b_ExtendedBorrowerInfo';
import Step2FinancialInfo from './Step2_FinancialInfo';
import Step2bEmploymentDetails from './Step2b_EmploymentDetails';
import Step2cAssetsLiabilities from './Step2c_AssetsLiabilities';
import Step3PropertyInfo from './Step3_PropertyInfo';
import Step4Declarations from './Step4_Declarations';
import Step6StateDisclosures from './Step6_StateDisclosures';
import Step7Acknowledgments from './Step7_Acknowledgments';
import Step8Demographics from './Step8_Demographics';
import Step5ReviewSubmit from './Step5_ReviewSubmit';

export const form1003Flow = [
  { component: Step0LoanType, label: 'Loan Type' },
  { component: Step1BorrowerInfo, label: 'Borrower Info' },
  { component: Step1bExtendedBorrowerInfo, label: 'Extended Info' },
  { component: Step2FinancialInfo, label: 'Financial Info' },
  { component: Step2bEmploymentDetails, label: 'Employment' },
  { component: Step2cAssetsLiabilities, label: 'Assets/Liabilities' },
  { component: Step3PropertyInfo, label: 'Property Info' },
  { component: Step4Declarations, label: 'Declarations' },
  { component: Step6StateDisclosures, label: 'State Disclosures' },
  { component: Step7Acknowledgments, label: 'Acknowledgments' },
  { component: Step8Demographics, label: 'Demographics' },
  { component: Step5ReviewSubmit, label: 'Review & Submit' },
];

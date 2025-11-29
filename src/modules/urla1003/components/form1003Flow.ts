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
  { component: Step1BorrowerInfo },
  { component: Step1bExtendedBorrowerInfo },
  { component: Step2FinancialInfo },
  { component: Step2bEmploymentDetails },
  { component: Step2cAssetsLiabilities },
  { component: Step3PropertyInfo },
  { component: Step4Declarations },
  { component: Step6StateDisclosures },
  { component: Step7Acknowledgments },
  { component: Step8Demographics },
  { component: Step5ReviewSubmit },
];

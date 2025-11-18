import Step1BorrowerInfo from './Step1_BorrowerInfo';
import Step2FinancialInfo from './Step2_FinancialInfo';
import Step3PropertyInfo from './Step3_PropertyInfo';
import Step4Declarations from './Step4_Declarations';
import Step5ReviewSubmit from './Step5_ReviewSubmit';

export const form1003Flow = [
  { component: Step1BorrowerInfo },
  { component: Step2FinancialInfo },
  { component: Step3PropertyInfo },
  { component: Step4Declarations },
  { component: Step5ReviewSubmit },
];

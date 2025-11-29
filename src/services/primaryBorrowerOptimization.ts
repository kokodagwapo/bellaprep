import type { FormData, CreditScore } from '../types';

export interface PrimaryBorrowerRecommendation {
  recommended: 'me' | 'coBorrower';
  reasoning: string;
  confidence: number;
  factors: {
    creditScore: string;
    incomeToDebt: string;
    employmentStability: string;
    assets: string;
    ausLikelihood: string;
  };
}

// Credit score numeric mapping
const creditScoreToNumber = (score: CreditScore | ''): number => {
  if (!score) return 0;
  if (score.includes('740+')) return 750;
  if (score.includes('700-739')) return 720;
  if (score.includes('640-699')) return 670;
  if (score.includes('580-639')) return 610;
  return 0;
};

// Calculate income-to-debt ratio
const calculateIncomeToDebtRatio = (income: number, debts: FormData['debts']): number => {
  if (!income || income === 0) return 0;
  const totalDebt = debts ? Object.entries(debts).reduce((sum, [key, val]) => {
    if (key === 'none') return sum;
    if (typeof val === 'number') return sum + val;
    return sum;
  }, 0) : 0;
  return totalDebt === 0 ? Infinity : income / (totalDebt || 1);
};

// Calculate employment stability score
const calculateEmploymentStability = (timeInJob?: FormData['timeInJob']): number => {
  if (!timeInJob) return 0;
  if (timeInJob === 'More than 2 years') return 100;
  if (timeInJob === '1-2 years') return 70;
  if (timeInJob === 'Less than 1 year') return 40;
  return 0;
};

// Calculate asset score
const calculateAssetScore = (assets?: FormData['assets']): number => {
  if (!assets || assets.skip) return 0;
  const totalAssets = Object.entries(assets).reduce((sum, [key, val]) => {
    if (key === 'skip') return sum;
    if (typeof val === 'number') return sum + val;
    return sum;
  }, 0);
  // Normalize to 0-100 scale (assuming $1M+ is max)
  return Math.min(100, (totalAssets / 10000));
};

export const optimizePrimaryBorrower = (data: FormData): PrimaryBorrowerRecommendation => {
  const primary = {
    creditScore: creditScoreToNumber(data.creditScore),
    income: data.income || 0,
    debts: data.debts || {},
    timeInJob: data.timeInJob,
    assets: data.assets || {},
  };

  const coBorrower = data.coBorrower ? {
    creditScore: creditScoreToNumber(data.coBorrower.estimatedCreditScore || ''),
    income: data.coBorrower.income || 0,
    debts: data.coBorrower.debts || {},
    assets: data.coBorrower.assets || {},
  } : null;

  // If no co-borrower, recommend primary
  if (!coBorrower) {
    return {
      recommended: 'me',
      reasoning: 'You are the only borrower on this application.',
      confidence: 100,
      factors: {
        creditScore: `Your credit score: ${data.creditScore || 'Not provided'}`,
        incomeToDebt: 'N/A - Single borrower',
        employmentStability: `Employment: ${data.timeInJob || 'Not provided'}`,
        assets: 'N/A',
        ausLikelihood: 'Standard single-borrower evaluation',
      },
    };
  }

  // Calculate scores for both
  const primaryScores = {
    credit: primary.creditScore,
    incomeDebtRatio: calculateIncomeToDebtRatio(primary.income, primary.debts),
    employment: calculateEmploymentStability(primary.timeInJob),
    assets: calculateAssetScore(primary.assets),
  };

  const coBorrowerScores = {
    credit: coBorrower.creditScore,
    incomeDebtRatio: calculateIncomeToDebtRatio(coBorrower.income, coBorrower.debts),
    employment: 50, // Default for co-borrower (would need employment data)
    assets: calculateAssetScore(coBorrower.assets),
  };

  // Weighted scoring: Credit (40%), Income/Debt (30%), Employment (20%), Assets (10%)
  const primaryTotal = 
    primaryScores.credit * 0.4 +
    Math.min((isFinite(primaryScores.incomeDebtRatio) ? primaryScores.incomeDebtRatio : 100) * 10, 100) * 0.3 +
    primaryScores.employment * 0.2 +
    primaryScores.assets * 0.1;

  const coBorrowerTotal = 
    coBorrowerScores.credit * 0.4 +
    Math.min((isFinite(coBorrowerScores.incomeDebtRatio) ? coBorrowerScores.incomeDebtRatio : 100) * 10, 100) * 0.3 +
    coBorrowerScores.employment * 0.2 +
    coBorrowerScores.assets * 0.1;

  // Lenders use the LOWEST credit score between both
  const lowestCreditScore = Math.min(primaryScores.credit, coBorrowerScores.credit);
  const highestCreditScore = Math.max(primaryScores.credit, coBorrowerScores.credit);

  // Determine recommendation
  let recommended: 'me' | 'coBorrower';
  let reasoning: string;
  let confidence: number;

  if (primaryScores.credit > coBorrowerScores.credit) {
    recommended = 'me';
    reasoning = `You have a higher credit score (${primaryScores.credit} vs ${coBorrowerScores.credit}). Since lenders use the lowest score between both borrowers, making you the primary borrower will help optimize the loan terms.`;
    confidence = 85;
  } else if (coBorrowerScores.credit > primaryScores.credit) {
    recommended = 'coBorrower';
    reasoning = `Your co-borrower has a higher credit score (${coBorrowerScores.credit} vs ${primaryScores.credit}). Making them the primary borrower will help optimize loan terms and potentially get better rates.`;
    confidence = 85;
  } else if (primaryScores.incomeDebtRatio > coBorrowerScores.incomeDebtRatio) {
    recommended = 'me';
    reasoning = `You have a better income-to-debt ratio. This suggests stronger financial stability, which lenders favor for primary borrowers.`;
    confidence = 75;
  } else if (coBorrowerScores.incomeDebtRatio > primaryScores.incomeDebtRatio) {
    recommended = 'coBorrower';
    reasoning = `Your co-borrower has a better income-to-debt ratio, indicating stronger financial stability.`;
    confidence = 75;
  } else {
    recommended = 'me';
    reasoning = `Both borrowers have similar profiles. You are recommended as primary, but either would work well.`;
    confidence = 60;
  }

  // Check if adding co-borrower actually helps
  const coBorrowerMonthlyDebts = Object.values(coBorrower.debts || {}).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0);
  if (coBorrower.income <= (coBorrowerMonthlyDebts * 12)) {
    reasoning += ` Note: Adding your co-borrower may not help if their income doesn't significantly exceed their debts.`;
  }

  return {
    recommended,
    reasoning,
    confidence,
    factors: {
      creditScore: `Primary: ${primaryScores.credit}, Co-Borrower: ${coBorrowerScores.credit} (Lenders use lowest: ${lowestCreditScore})`,
      incomeToDebt: `Primary: ${primaryScores.incomeDebtRatio.toFixed(2)}x, Co-Borrower: ${coBorrowerScores.incomeDebtRatio.toFixed(2)}x`,
      employmentStability: `Primary: ${data.timeInJob || 'Not provided'}`,
      assets: `Both borrowers have assets that can support the loan.`,
      ausLikelihood: `Better primary = faster AUS approval + better rate. Recommended: ${recommended === 'me' ? 'You' : 'Co-Borrower'}.`,
    },
  };
};


import type { FormData } from '../types';

export const calculateProgress = (formData: FormData): number => {
  const sections: Array<{ key: string; weight: number; isCompleted: (data: FormData) => boolean }> = [
    { key: 'goal', weight: 5, isCompleted: (d) => !!d.goal },
    { key: 'propertyType', weight: 5, isCompleted: (d) => !!d.propertyType },
    { key: 'propertyUse', weight: 5, isCompleted: (d) => !!d.propertyUse },
    { key: 'primaryResidenceIntent', weight: 5, isCompleted: (d) => 
      !!(d.primaryResidenceIntent?.moveInWithin60Days !== undefined && 
         d.primaryResidenceIntent?.liveAtLeast12Months !== undefined) 
    },
    { key: 'subjectProperty', weight: 5, isCompleted: (d) => 
      !!(d.subjectProperty?.hasProperty !== undefined && 
         (d.subjectProperty.hasProperty 
           ? (d.subjectProperty.address?.street && d.subjectProperty.address?.zip && d.subjectProperty.value)
           : (d.subjectProperty.budgetRange && d.subjectProperty.targetZip)))
    },
    { key: 'currentHousingStatus', weight: 5, isCompleted: (d) => !!d.currentHousingStatus },
    { key: 'employmentStatus', weight: 5, isCompleted: (d) => !!d.employmentStatus },
    { key: 'timeInJob', weight: 5, isCompleted: (d) => !!d.timeInJob && !!(d.income && d.income > 0) },
    { key: 'debts', weight: 5, isCompleted: (d) => 
      !!(d.debts && (d.debts.none || Object.keys(d.debts).filter(k => k !== 'none').length > 0))
    },
    { key: 'assets', weight: 5, isCompleted: (d) => 
      !!(d.assets && (d.assets.skip || Object.keys(d.assets).filter(k => k !== 'skip').length > 0))
    },
    { key: 'coBorrower', weight: 5, isCompleted: (d) => 
      d.coBorrower !== undefined || !d.coBorrower
    },
    { key: 'primaryBorrowerOptimization', weight: 5, isCompleted: (d) => 
      !!(d.primaryBorrowerOptimization?.selected)
    },
    { key: 'documents', weight: 5, isCompleted: () => true }, // Optional, always true
    { key: 'dmvVerification', weight: 5, isCompleted: (d) => 
      !!(d.dmvVerification?.idVerified && d.dmvVerification?.addressVerified)
    },
    { key: 'affordabilitySnapshot', weight: 5, isCompleted: (d) => !!d.affordabilitySnapshot },
    { key: 'reviewChecklist', weight: 5, isCompleted: () => true }, // Always true if reached
    { key: 'summary', weight: 5, isCompleted: () => true }, // Always true if reached
  ];

  const totalWeight = sections.reduce((sum, section) => sum + section.weight, 0);
  const completedWeight = sections.reduce((sum, section) => {
    return sum + (section.isCompleted(formData) ? section.weight : 0);
  }, 0);

  return Math.round((completedWeight / totalWeight) * 100);
};


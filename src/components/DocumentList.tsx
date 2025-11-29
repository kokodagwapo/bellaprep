import React from 'react';
import { motion } from 'framer-motion';
import { FormData } from '../types';
import { getRequirements } from '../data/requirements';
import { FileText, CheckCircle2, Circle, Lightbulb, TrendingUp, Shield, Clock } from './icons';

interface DocumentListProps {
  formData: FormData;
}

const DocumentList: React.FC<DocumentListProps> = ({ formData }) => {
  const prep4LoanRequirements = getRequirements(formData.loanPurpose);
  const prep4LoanCompleted = prep4LoanRequirements.filter(r => r.isCompleted(formData)).length;
  const prep4LoanProgress = (prep4LoanCompleted / prep4LoanRequirements.length) * 100;

  // URLA 1003 requirements
  const urla1003Steps = [
    { key: 'borrowerInfo', label: 'Borrower Information', completed: !!(formData.fullName && formData.email && formData.phoneNumber && formData.dob && formData.borrowerAddress) },
    { key: 'financialInfo', label: 'Financial Information', completed: !!(formData.income && formData.income > 0) },
    { key: 'propertyInfo', label: 'Property Information', completed: !!(formData.propertyType && formData.propertyUse && formData.location) },
    { key: 'declarations', label: 'Declarations', completed: !!(formData.isFirstTimeBuyer !== null && formData.isMilitary !== null) },
  ];
  const urla1003Completed = urla1003Steps.filter(s => s.completed).length;
  const urla1003Progress = (urla1003Completed / urla1003Steps.length) * 100;

  const firstTimeBuyerTips = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "First-Time Homebuyer Programs",
      content: "Explore FHA loans, VA loans, and state-specific programs that offer lower down payments and better rates for first-time buyers."
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Down Payment Assistance",
      content: "Many states and local governments offer down payment assistance programs. Research grants and loans available in your area."
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Credit Score Tips",
      content: "Aim for a credit score of 740+ for the best rates. Pay down debts, avoid new credit applications, and check your credit report for errors."
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Document Preparation",
      content: "Keep 2-3 months of bank statements, pay stubs, tax returns, and W-2s ready. Having documents organized speeds up the process."
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in my-4 sm:my-6 md:my-8 px-3 sm:px-4 md:px-6">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 sm:mb-5 tracking-tight px-2">Document List</h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light px-2" style={{ color: '#6b7280' }}>Track your progress and see what's needed for your mortgage application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Prep4Loan Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Prep4Loan</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Pre-Evaluation Requirements</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl sm:text-2xl font-bold text-primary">{Math.round(prep4LoanProgress)}%</div>
              <div className="text-xs text-muted-foreground">{prep4LoanCompleted}/{prep4LoanRequirements.length}</div>
            </div>
          </div>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${prep4LoanProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          <div className="space-y-3">
            {prep4LoanRequirements.map((req, index) => {
              const isCompleted = req.isCompleted(formData);
              return (
                <motion.div
                  key={req.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${isCompleted ? 'text-foreground line-through opacity-60' : 'text-foreground'}`}>
                    {req.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {prep4LoanProgress === 100 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20 text-center"
            >
              <div className="text-2xl mb-2">🎉</div>
              <p className="text-sm font-semibold text-foreground">All Prep4Loan requirements complete!</p>
            </motion.div>
          )}
        </motion.div>

        {/* URLA 1003 Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl sm:rounded-2xl border border-border shadow-lg p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Loan Application</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">URLA Form 1003</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl sm:text-2xl font-bold text-primary">{Math.round(urla1003Progress)}%</div>
              <div className="text-xs text-muted-foreground">{urla1003Completed}/{urla1003Steps.length}</div>
            </div>
          </div>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${urla1003Progress}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />
          </div>

          <div className="space-y-3">
            {urla1003Steps.map((step, index) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm font-medium ${step.completed ? 'text-foreground line-through opacity-60' : 'text-foreground'}`}>
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>

          {urla1003Progress === 100 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20 text-center"
            >
              <div className="text-2xl mb-2">🎉</div>
              <p className="text-sm font-semibold text-foreground">All URLA 1003 sections complete!</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Tips and Advice Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl border border-primary/20 p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Tips & Advice</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Especially helpful for first-time homebuyers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {firstTimeBuyerTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1 text-sm">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentList;


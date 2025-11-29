import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface DataTransferIndicatorProps {
  isVisible: boolean;
  transferredFields: number;
}

const DataTransferIndicator: React.FC<DataTransferIndicatorProps> = ({
  isVisible,
  transferredFields
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] 
        bg-white border-2 border-primary rounded-2xl shadow-2xl p-6 min-w-[320px] text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="flex justify-center mb-4"
      >
        <div className="relative">
          <div className="p-4 bg-primary/10 rounded-full">
            <ArrowRight className="h-8 w-8 text-primary" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
          >
            <CheckCircle2 className="h-4 w-4 text-white" />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold mb-2 text-gray-800"
      >
        Data Transfer Complete
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-gray-600 mb-3"
      >
        {transferredFields} fields transferred from Prep4Loan
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-4"
      >
        <p className="text-xs font-medium text-primary">
          ✓ Backward Compatible URLA 1003
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Guideline-ready for your systems
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DataTransferIndicator;


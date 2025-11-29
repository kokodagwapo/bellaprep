import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { TimeEstimate as TimeEstimateType, formatTimeEstimate } from '../utils/timeEstimator';

interface TimeEstimateProps {
  estimate: TimeEstimateType;
  showPercentage?: boolean;
}

const TimeEstimate: React.FC<TimeEstimateProps> = ({ estimate, showPercentage = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-6 z-50 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-4 min-w-[200px]"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-light mb-1">Time Remaining</p>
          <p className="text-lg font-semibold text-foreground">
            {formatTimeEstimate(estimate)}
          </p>
          {showPercentage && (
            <p className="text-xs text-gray-400 mt-1">
              {Math.round(estimate.percentageComplete)}% complete
            </p>
          )}
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${estimate.percentageComplete}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export default TimeEstimate;


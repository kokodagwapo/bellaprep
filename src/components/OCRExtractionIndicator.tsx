import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2 } from 'lucide-react';

interface OCRExtractionIndicatorProps {
  documentType: string;
  extractedFields: string[];
  isVisible: boolean;
}

const OCRExtractionIndicator: React.FC<OCRExtractionIndicatorProps> = ({
  documentType,
  extractedFields,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        className="fixed top-24 right-6 z-50 bg-white border-2 border-primary/30 rounded-xl shadow-xl p-4 min-w-[280px]"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-2 bg-primary/10 rounded-lg"
          >
            <FileText className="h-5 w-5 text-primary" />
          </motion.div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              OCR: {documentType}
            </h4>
            <div className="space-y-1.5">
              {extractedFields.map((field, idx) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2 text-xs text-gray-600"
                >
                  <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>{field}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OCRExtractionIndicator;


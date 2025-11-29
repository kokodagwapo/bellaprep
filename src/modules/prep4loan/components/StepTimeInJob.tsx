import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepHeader from './StepHeader';
import { SelectionButton } from './StepHeader';
import StepNavigation from './StepNavigation';
import { Clock, Lightbulb, UploadCloud } from './icons';
import { extractDataFromDocument } from '../services/ocrService';
import type { FormData } from '../types';

interface StepTimeInJobProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const timeInJobOptions = [
  { value: 'Less than 1 year' as const, label: 'Less than 1 year' },
  { value: '1-2 years' as const, label: '1-2 years' },
  { value: 'More than 2 years' as const, label: 'More than 2 years' },
];

const StepTimeInJob: React.FC<StepTimeInJobProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [timeInJob, setTimeInJob] = useState<FormData['timeInJob']>(data.timeInJob);
  const [income, setIncome] = useState<number>(data.income || 0);
  const [showPriorEmployment, setShowPriorEmployment] = useState(false);
  const [priorEmployment, setPriorEmployment] = useState(data.priorEmployment || {});
  const [showTooltip, setShowTooltip] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const needsPriorEmployment = timeInJob === 'Less than 1 year' || timeInJob === '1-2 years';

  const handleTimeInJobSelect = (value: FormData['timeInJob']) => {
    setTimeInJob(value);
    onChange('timeInJob', value);
    if (value === 'Less than 1 year' || value === '1-2 years') {
      setShowPriorEmployment(true);
    } else {
      setShowPriorEmployment(false);
    }
  };

  const handlePriorEmploymentChange = (field: string, value: any) => {
    const updated = { ...priorEmployment, [field]: value };
    setPriorEmployment(updated);
    onChange('priorEmployment', updated);
  };

  const handleIncomeChange = (value: number) => {
    setIncome(value);
    onChange('income', value);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const file = files[0];
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (!result || !result.includes(',')) {
            reject(new Error('Failed to read file'));
            return;
          }
          const base64 = result.split(',')[1];
          if (!base64) {
            reject(new Error('Invalid file data'));
            return;
          }
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('File reading error'));
        reader.readAsDataURL(file);
      });

      const extractedData = await extractDataFromDocument({ 
        data: base64Data, 
        mimeType: file.type || 'application/octet-stream' 
      });

      if (extractedData.income) {
        handleIncomeChange(extractedData.income);
      }
      if (extractedData.fullName && !priorEmployment.employerName) {
        handlePriorEmploymentChange('employerName', extractedData.fullName);
      }
    } catch (error: any) {
      console.error('Error processing file:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const canProceed = timeInJob && income > 0 && (
    !needsPriorEmployment || 
    (priorEmployment.employerName && priorEmployment.jobType && priorEmployment.timeInPreviousJob)
  );

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="Time in Current Job"
        subtitle="How long have you been in this job?"
      />
      
      {/* Bella's Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded-md flex items-start gap-3 mt-4 mb-6">
        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
        <p className="text-sm">
          <span className="font-semibold">Bella's Insight:</span> Lenders require a total of <strong>24 months of work history</strong>. If you've been in your current job for less than 24 months, we'll need information about your previous employment. Jobs don't need to be the same or continuous!
        </p>
      </div>
      
      <div className="space-y-6 mt-6">
        <div>
          <div className="grid grid-cols-1 gap-4">
            {timeInJobOptions.map((option) => (
              <SelectionButton
                key={option.value}
                label={option.label}
                icon={<Clock className="h-6 w-6" />}
                isSelected={timeInJob === option.value}
                onClick={() => handleTimeInJobSelect(option.value)}
              />
            ))}
          </div>
        </div>

        {needsPriorEmployment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-blue-800">
                    <strong>Lenders need 2-year history (1003 requirement).</strong> Please provide your prior employment information.
                  </p>
                </div>
                <button
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <Clock className="h-5 w-5" />
                </button>
              </div>
            </div>

            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 p-4 rounded-lg"
              >
                <p className="text-sm text-blue-900">
                  Mortgage lenders typically require at least 2 years of employment history. 
                  If you've been at your current job for less than 2 years, we need information 
                  about your previous employment to meet this requirement.
                </p>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Previous Employer (optional)
              </label>
              <input
                type="text"
                value={priorEmployment.employerName || ''}
                onChange={(e) => handlePriorEmploymentChange('employerName', e.target.value)}
                placeholder="Company Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Job Type *
              </label>
              <input
                type="text"
                value={priorEmployment.jobType || ''}
                onChange={(e) => handlePriorEmploymentChange('jobType', e.target.value)}
                placeholder="e.g., Software Engineer, Teacher, Manager"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time in Previous Job *
              </label>
              <input
                type="text"
                value={priorEmployment.timeInPreviousJob || ''}
                onChange={(e) => handlePriorEmploymentChange('timeInPreviousJob', e.target.value)}
                placeholder="e.g., 2 years, 18 months"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </motion.div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Gross Monthly Income *
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="50000"
              step="100"
              value={income}
              onChange={(e) => handleIncomeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">$0</span>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">${income.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
              <span className="text-sm text-muted-foreground">$50,000</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Optional: Upload Pay Stub or W-2 to Auto-Verify
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <UploadCloud className="h-8 w-8 text-muted-foreground mr-3" />
            <div>
              <p className="font-semibold text-foreground">Click to upload documents</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, or PNG</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              accept="image/*,application/pdf"
            />
          </div>
          {isUploading && (
            <p className="mt-2 text-sm text-primary">Processing document...</p>
          )}
        </div>
      </div>

      <StepNavigation onNext={canProceed ? onNext : undefined} onBack={onBack} />
    </div>
  );
};

export default StepTimeInJob;


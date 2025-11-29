import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import { CheckCircle2, AlertCircle, Loader } from './icons';
import { 
  verifyIDWithDMV, 
  verifyCurrentAddress, 
  verifySubjectProperty,
  getCityStateFromZip 
} from '../services/addressVerificationService';
import type { FormData } from '../types';

interface StepDMVAddressVerificationProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepDMVAddressVerification: React.FC<StepDMVAddressVerificationProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}) => {
  const [verification, setVerification] = useState(data.dmvVerification || {
    idVerified: false,
    addressVerified: false,
    propertyVerified: false,
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const performVerification = async () => {
      setIsVerifying(true);
      setErrors([]);

      try {
        // Verify ID with DMV
        if (data.fullName && data.dob && data.borrowerAddress) {
          const dmvResult = await verifyIDWithDMV({
            fullName: data.fullName,
            dob: data.dob,
            address: data.borrowerAddress,
          });
          
          setVerification(prev => ({
            ...prev,
            idVerified: dmvResult.idVerified,
            addressVerified: dmvResult.addressMatch,
          }));
          
          if (dmvResult.errors) {
            setErrors(prev => [...prev, ...dmvResult.errors || []]);
          }
        }

        // Verify current address
        if (data.borrowerAddress) {
          const addressVerified = await verifyCurrentAddress(data.borrowerAddress);
          setVerification(prev => ({
            ...prev,
            addressVerified: addressVerified || prev.addressVerified,
          }));
        }

        // Verify subject property
        if (data.subjectProperty?.address) {
          const propertyResult = await verifySubjectProperty(data.subjectProperty.address);
          setVerification(prev => ({
            ...prev,
            propertyVerified: propertyResult.isValid,
          }));
          
          if (propertyResult.errors) {
            setErrors(prev => [...prev, ...propertyResult.errors || []]);
          }
        }

        onChange('dmvVerification', verification);
      } catch (error: any) {
        console.error('Verification error:', error);
        setErrors(prev => [...prev, error.message || 'Verification failed']);
      } finally {
        setIsVerifying(false);
      }
    };

    performVerification();
  }, []);

  const canProceed = verification.idVerified && verification.addressVerified;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <StepHeader 
        title="DMV + Address Verification"
        subtitle="Verifying your information"
      />
      
      <div className="space-y-6 mt-6">
        {isVerifying && (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-8 w-8 text-primary animate-spin mr-3" />
            <p className="text-lg text-foreground">Verifying your information...</p>
          </div>
        )}

        {!isVerifying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={`p-4 rounded-lg border-2 ${
              verification.idVerified 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {verification.idVerified ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    ID Verification: {verification.idVerified ? 'Verified' : 'Not Verified'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {verification.idVerified 
                      ? 'Your ID has been verified with DMV records.' 
                      : 'Could not verify ID. Please check your information.'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              verification.addressVerified 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {verification.addressVerified ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    Current Address: {verification.addressVerified ? 'Verified' : 'Not Verified'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {verification.addressVerified 
                      ? 'Your current address has been verified.' 
                      : 'Address verification failed. Please check your address.'}
                  </p>
                </div>
              </div>
            </div>

            {data.subjectProperty?.address && (
              <div className={`p-4 rounded-lg border-2 ${
                verification.propertyVerified 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-3">
                  {verification.propertyVerified ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      Subject Property: {verification.propertyVerified ? 'Verified' : 'Needs Review'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {verification.propertyVerified 
                        ? 'Property address has been verified.' 
                        : 'Property address needs manual verification.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="font-semibold text-red-900 mb-2">Verification Issues:</p>
                <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <StepNavigation onNext={canProceed ? onNext : undefined} onBack={onBack} />
    </div>
  );
};

export default StepDMVAddressVerification;


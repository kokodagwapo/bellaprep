import React, { useState, useRef, useCallback } from 'react';
import StepHeader from './StepHeader';
import StepNavigation from './StepNavigation';
import { UploadCloud, FileCheck2, Loader, AlertCircle, FileText } from './icons';
import { extractDataFromDocument } from '../services/ocrService';
import type { FormData } from '../types';

interface StepPrepDocsProps {
  onDataChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

type FileStatus = 'processing' | 'completed' | 'error';

interface UploadedFile {
  name: string;
  status: FileStatus;
  message: string;
}

const documentCards = [
    { key: 'driversLicense', label: "Driver's License", icon: <FileText className="h-6 w-6" /> },
    { key: 'payStubs', label: "Pay Stubs", icon: <FileText className="h-6 w-6" /> },
    { key: 'w2', label: "W-2", icon: <FileText className="h-6 w-6" /> },
    { key: 'bankStatements', label: "Bank Statements", icon: <FileText className="h-6 w-6" /> },
    { key: 'titleDeed', label: "Title/Deed (if paid off)", icon: <FileText className="h-6 w-6" />, optional: true },
    { key: 'skip', label: "Skip", icon: <FileText className="h-6 w-6" />, optional: true },
];


const StepPrepDocs: React.FC<StepPrepDocsProps> = ({ onDataChange, onNext, onBack }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesToProcess = Array.from(files);

    // Validate file types and sizes
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'];

    const validFiles: File[] = [];
    const invalidFiles: { name: string; reason: string }[] = [];

    filesToProcess.forEach(file => {
        const fileType = file.type.toLowerCase();
        const isValidType = validTypes.some(type => fileType.includes(type.split('/')[1]));
        
        if (!isValidType) {
            invalidFiles.push({ name: file.name, reason: 'Unsupported file type' });
        } else if (file.size > maxFileSize) {
            invalidFiles.push({ name: file.name, reason: 'File too large (max 10MB)' });
        } else if (file.size === 0) {
            invalidFiles.push({ name: file.name, reason: 'Empty file' });
        } else {
            validFiles.push(file);
        }
    });

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
        invalidFiles.forEach(({ name, reason }) => {
            setUploadedFiles(prev => [...prev, {
                name,
                status: 'error',
                message: reason
            }]);
        });
    }

    if (validFiles.length === 0) return;

    const newFileUploads: UploadedFile[] = validFiles.map(file => ({
        name: file.name,
        status: 'processing',
        message: 'Analyzing document with OCR...',
    }));

    setUploadedFiles(prev => [...prev, ...newFileUploads]);

    // Process files sequentially to avoid overwhelming the API
    for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        try {
            // Update status to processing
            setUploadedFiles(prev => prev.map(f => 
                f.name === file.name ? { ...f, status: 'processing', message: 'Reading file...' } : f
            ));

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

            setUploadedFiles(prev => prev.map(f => 
                f.name === file.name ? { ...f, status: 'processing', message: 'Extracting data with OCR...' } : f
            ));

            const extractedData = await extractDataFromDocument({ 
                data: base64Data, 
                mimeType: file.type || 'application/octet-stream' 
            });
            
            // Only update form data if we actually extracted something
            const hasData = Object.keys(extractedData).length > 0;
            if (hasData) {
                onDataChange(extractedData);
                setUploadedFiles(prev => prev.map(f => 
                    f.name === file.name ? { 
                        ...f, 
                        status: 'completed', 
                        message: `Data extracted! Found: ${Object.keys(extractedData).join(', ')}` 
                    } : f
                ));
            } else {
                setUploadedFiles(prev => prev.map(f => 
                    f.name === file.name ? { 
                        ...f, 
                        status: 'completed', 
                        message: 'Document processed, but no extractable data found' 
                    } : f
                ));
            }

        } catch (error: any) {
            console.error("Error processing file:", error);
            const errorMessage = error.message || 'Could not analyze this file';
            setUploadedFiles(prev => prev.map(f => 
                f.name === file.name ? { 
                    ...f, 
                    status: 'error', 
                    message: errorMessage.length > 50 ? errorMessage.substring(0, 50) + '...' : errorMessage
                } : f
            ));
        }
    }
  };

  const StatusIcon = ({ status }: { status: FileStatus }) => {
    switch(status) {
        case 'processing': return <Loader className="h-5 w-5 text-muted-foreground animate-spin" />;
        case 'completed': return <FileCheck2 className="h-5 w-5 text-green-600" />;
        case 'error': return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div>
      <StepHeader
        title="Document Uploads"
        subtitle="Upload your documents for OCR auto-extraction. You can upload them here or do it later."
      />
      
      <div className="space-y-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentCards.map((doc) => (
            <button
              key={doc.key}
              onClick={() => {
                if (doc.key === 'skip') {
                  onNext();
                } else {
                  setSelectedDocType(doc.key);
                  fileInputRef.current?.click();
                }
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedDocType === doc.key
                  ? 'bg-primary/10 border-primary'
                  : 'bg-white border-gray-300 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedDocType === doc.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-primary'
                }`}>
                  {doc.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{doc.label}</p>
                  {doc.optional && (
                    <p className="text-xs text-muted-foreground">Optional</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

            <div 
                onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
            >
          <UploadCloud className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="font-semibold text-foreground text-lg">Click to upload documents</p>
          <p className="text-sm text-muted-foreground mt-2">PDF, JPG, or PNG</p>
          <p className="text-xs text-muted-foreground mt-1">OCR will auto-extract: Address, DOB, Employer, Income, Balances</p>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    accept="image/*,application/pdf"
                />
        </div>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
            <h4 className="font-semibold text-sm mb-2 text-foreground">Uploads</h4>
            <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center bg-secondary/50 p-3 rounded-md border border-border text-sm">
                        <StatusIcon status={file.status} />
                        <div className="ml-3 flex-1 overflow-hidden">
                            <p className="font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      <StepNavigation onNext={onNext} onBack={onBack} />
    </div>
  );
};

export default StepPrepDocs;

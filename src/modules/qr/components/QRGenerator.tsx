import React, { useState } from 'react';
import { apiClient } from '../../../lib/api';

const QRGenerator: React.FC = () => {
  const [qrType, setQrType] = useState('LOGIN');
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/qr', {
        type: qrType,
        expiresInMinutes: 1440, // 24 hours
      });
      setQrCode(response.qrCodeImage);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Generate QR Code</h2>
      <div className="space-y-4">
        <select
          value={qrType}
          onChange={(e) => setQrType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="LOGIN">Login</option>
          <option value="PORTAL_START">Portal Start</option>
          <option value="DOCUMENT_UPLOAD">Document Upload</option>
          <option value="LOAN_HANDOFF">Loan Handoff</option>
        </select>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate QR Code'}
        </button>
        {qrCode && (
          <div className="mt-4">
            <img src={qrCode} alt="QR Code" className="mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;


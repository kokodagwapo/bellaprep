import React, { useState } from 'react';
import { authApi } from '../../../lib/api';

const MFASetup: React.FC = () => {
  const [mfaType, setMfaType] = useState<'totp' | 'sms' | 'email'>('totp');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetup = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.setupMfa({ type: mfaType });
      setSecret(response.secret);
      setQrCode(response.qrCode);
    } catch (err: any) {
      setError(err.message || 'Failed to setup MFA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable = async () => {
    if (!secret || !verificationCode) {
      setError('Please complete setup first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authApi.enableMfa({ secret, code: verificationCode });
      alert('MFA enabled successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to enable MFA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Setup Multi-Factor Authentication</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          MFA Type
        </label>
        <select
          value={mfaType}
          onChange={(e) => setMfaType(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="totp">Authenticator App (TOTP)</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>
      </div>

      <button
        onClick={handleSetup}
        disabled={isLoading}
        className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? 'Setting up...' : 'Generate Setup Code'}
      </button>

      {qrCode && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Scan this QR code with your authenticator app:
          </p>
          <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
          />
          <button
            onClick={handleEnable}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Enable MFA
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default MFASetup;


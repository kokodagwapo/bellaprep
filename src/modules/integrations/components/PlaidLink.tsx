import React, { useState } from 'react';
import { apiClient } from '../../../lib/api';

interface PlaidLinkProps {
  borrowerId: string;
  onSuccess?: () => void;
}

const PlaidLink: React.FC<PlaidLinkProps> = ({ borrowerId, onSuccess }) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ linkToken: string }>('/plaid/link-token', {});
      setLinkToken(response.linkToken);
      // In production, use Plaid Link component
      alert('Plaid Link initialized. In production, this would open Plaid Link modal.');
    } catch (error) {
      console.error('Error initializing Plaid:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Connect Bank Account</h3>
      <button
        onClick={handleInitialize}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Connect with Plaid'}
      </button>
    </div>
  );
};

export default PlaidLink;


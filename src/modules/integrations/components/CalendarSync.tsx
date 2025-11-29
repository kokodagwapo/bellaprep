import React, { useState } from 'react';
import { apiClient } from '../../../lib/api';

const CalendarSync: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ authUrl: string }>('/calendar/auth-url', {
        params: { redirectUri: window.location.origin + '/calendar/callback' },
      });
      window.location.href = response.authUrl;
    } catch (error) {
      console.error('Error connecting calendar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Calendar Integration</h3>
      {isConnected ? (
        <div className="text-green-600">✓ Connected to Google Calendar</div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
        </button>
      )}
    </div>
  );
};

export default CalendarSync;


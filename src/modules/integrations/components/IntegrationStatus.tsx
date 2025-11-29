import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface IntegrationStatusProps {
  name: string;
  enabled: boolean;
  onToggle?: (enabled: boolean) => void;
}

const IntegrationStatus: React.FC<IntegrationStatusProps> = ({ name, enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        {enabled ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-gray-400" />
        )}
        <span className="font-medium">{name}</span>
      </div>
      {onToggle && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-sm">{enabled ? 'Enabled' : 'Disabled'}</span>
        </label>
      )}
    </div>
  );
};

export default IntegrationStatus;


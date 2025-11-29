import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../../../components/ui/toast';

interface QRCode {
  id: string;
  type: string;
  name: string;
  url: string;
  scans: number;
  createdAt: string;
}

const QRSettings: React.FC = () => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([
    {
      id: '1',
      type: 'login',
      name: 'QR Login',
      url: 'https://bellaprep.com/qr/login/abc123',
      scans: 45,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      type: 'portal',
      name: 'Borrower Portal Start',
      url: 'https://bellaprep.com/qr/portal/xyz789',
      scans: 128,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      type: 'document',
      name: 'Document Upload',
      url: 'https://bellaprep.com/qr/upload/def456',
      scans: 67,
      createdAt: '2024-01-12'
    },
  ]);

  const qrTypes = [
    { id: 'login', label: 'QR Login', description: 'Quick login for borrowers' },
    { id: 'portal', label: 'Borrower Portal Start', description: 'Start borrower application flow' },
    { id: 'document', label: 'Document Upload', description: 'Direct document upload link' },
    { id: 'handoff', label: 'Loan Handoff', description: 'Transfer loan to another LO' },
    { id: 'appointment', label: 'Appointment Check-In', description: 'Check-in for appointments' },
    { id: 'underwriter', label: 'Underwriter Access', description: 'Secure file access for underwriters' },
    { id: 'closer', label: 'Closer Packet', description: 'Closing document access' },
  ];

  const { showToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedType, setSelectedType] = useState('login');

  const handleCreateQR = () => {
    // TODO: Implement API call
    const qrType = qrTypes.find(t => t.id === selectedType);
    showToast(`QR code created for ${qrType?.label}`, 'success');
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">QR Code Center</h1>
            <p className="text-base text-muted-foreground font-light" style={{ color: '#6b7280' }}>
              Generate and manage QR codes for various borrower and lender workflows
            </p>
          </div>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-light transition-colors"
          >
            + Generate QR Code
          </motion.button>
        </div>

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {qrCodes.map((qr) => (
            <motion.div
              key={qr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-foreground">{qr.name}</h3>
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">QR</span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-xs text-muted-foreground font-light">URL</div>
                <code className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded block truncate">
                  {qr.url}
                </code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-light">
                  {qr.scans} scans
                </span>
                <div className="flex gap-2">
                  <button className="text-primary hover:text-primary/80 font-light text-xs">Download</button>
                  <button className="text-gray-600 hover:text-gray-800 font-light text-xs">Copy</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* QR Types Info */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
          <h2 className="text-xl font-light text-foreground mb-4">Available QR Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qrTypes.map((type) => (
              <div key={type.id} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-foreground mb-1">{type.label}</h3>
                <p className="text-xs text-muted-foreground font-light">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
            >
              <h2 className="text-xl font-light text-foreground mb-4">Generate QR Code</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">QR Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                  >
                    {qrTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-light transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleCreateQR}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-light transition-colors"
                  >
                    Generate
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QRSettings;


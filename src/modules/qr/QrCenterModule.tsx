import React, { useState } from 'react';

interface QRCode {
  id: string;
  name: string;
  type: 'login' | 'document' | 'appointment' | 'handoff';
  url: string;
  scans: number;
  createdAt: string;
  expiresAt?: string;
  active: boolean;
}

const defaultQRCodes: QRCode[] = [
  { id: '1', name: 'Borrower Portal Login', type: 'login', url: 'https://app.bellaprep.com/qr/login/abc123', scans: 145, createdAt: '2024-01-15', active: true },
  { id: '2', name: 'Document Upload Link', type: 'document', url: 'https://app.bellaprep.com/qr/docs/xyz789', scans: 89, createdAt: '2024-01-20', active: true },
  { id: '3', name: 'Schedule Appointment', type: 'appointment', url: 'https://app.bellaprep.com/qr/appt/def456', scans: 34, createdAt: '2024-02-01', active: true },
  { id: '4', name: 'LO Handoff - John Smith', type: 'handoff', url: 'https://app.bellaprep.com/qr/handoff/ghi012', scans: 12, createdAt: '2024-02-10', expiresAt: '2024-03-10', active: false },
];

const QrCenterModule: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCode[]>(defaultQRCodes);
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQR, setNewQR] = useState({ name: '', type: 'login' as QRCode['type'] });

  const createQRCode = () => {
    const qr: QRCode = {
      id: Date.now().toString(),
      name: newQR.name,
      type: newQR.type,
      url: 'https://app.bellaprep.com/qr/' + newQR.type + '/' + Math.random().toString(36).substr(2, 9),
      scans: 0,
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
    };
    setQrCodes([qr, ...qrCodes]);
    setShowCreateModal(false);
    setNewQR({ name: '', type: 'login' });
  };

  const toggleActive = (id: string) => {
    setQrCodes(qrCodes.map(qr => qr.id === id ? { ...qr, active: !qr.active } : qr));
  };

  const typeIcons: Record<string, string> = { login: '🔐', document: '📄', appointment: '📅', handoff: '🤝' };
  const typeLabels: Record<string, string> = { login: 'Portal Login', document: 'Document Upload', appointment: 'Appointment', handoff: 'LO Handoff' };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">QR Code Center</h1>
          <p className="mt-1 text-gray-500">Generate and manage QR codes for borrower interactions.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Create QR Code
        </button>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {['login', 'document', 'appointment', 'handoff'].map(type => (
          <div key={type} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <span className="text-2xl">{typeIcons[type]}</span>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{qrCodes.filter(qr => qr.type === type).length}</p>
            <p className="text-xs text-gray-500">{typeLabels[type]}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium text-gray-900">All QR Codes</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {qrCodes.map(qr => (
                <div key={qr.id} className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedQR?.id === qr.id ? 'bg-blue-50' : ''}`} onClick={() => setSelectedQR(qr)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{typeIcons[qr.type]}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{qr.name}</h3>
                        <p className="text-xs text-gray-500">{typeLabels[qr.type]} • {qr.scans} scans</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${qr.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {qr.active ? 'Active' : 'Inactive'}
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); toggleActive(qr.id); }}
                        className={`w-10 h-5 rounded-full relative ${qr.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${qr.active ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedQR ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-center mb-4">
                <div className="w-32 h-32 bg-gray-100 rounded-xl mx-auto flex items-center justify-center mb-3">
                  <span className="text-5xl">{typeIcons[selectedQR.type]}</span>
                </div>
                <h2 className="font-semibold text-gray-900">{selectedQR.name}</h2>
                <p className="text-sm text-gray-500">{typeLabels[selectedQR.type]}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Scans</span><span className="font-medium">{selectedQR.scans}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Created</span><span className="font-medium">{selectedQR.createdAt}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`font-medium ${selectedQR.active ? 'text-green-600' : 'text-gray-600'}`}>{selectedQR.active ? 'Active' : 'Inactive'}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm">Download QR</button>
                <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Copy Link</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <p className="text-gray-500">Select a QR code to view details</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create QR Code</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={newQR.name} onChange={(e) => setNewQR({ ...newQR, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., Borrower Login QR" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={newQR.type} onChange={(e) => setNewQR({ ...newQR, type: e.target.value as QRCode['type'] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="login">Portal Login</option>
                  <option value="document">Document Upload</option>
                  <option value="appointment">Appointment Scheduling</option>
                  <option value="handoff">LO Handoff</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
                <button onClick={createQRCode} disabled={!newQR.name} className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCenterModule;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Plus,
  Download,
  Copy,
  Eye,
  Trash2,
  Link,
  Upload,
  UserCheck,
  FileText,
} from 'lucide-react';

interface QRCode {
  id: string;
  name: string;
  purpose: string;
  scans: number;
  createdAt: string;
  status: 'active' | 'expired' | 'revoked';
}

const purposeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  BORROWER_LOGIN: { label: 'Borrower Login', icon: <UserCheck className="w-4 h-4" />, color: 'blue' },
  DOCUMENT_UPLOAD: { label: 'Document Upload', icon: <Upload className="w-4 h-4" />, color: 'emerald' },
  LOAN_APPLICATION: { label: 'Loan Application', icon: <FileText className="w-4 h-4" />, color: 'purple' },
  LOAN_HANDOFF: { label: 'Loan Handoff', icon: <Link className="w-4 h-4" />, color: 'orange' },
};

export const QRCenterPage: React.FC = () => {
  const [qrCodes] = useState<QRCode[]>([
    { id: '1', name: 'Office Lobby QR', purpose: 'BORROWER_LOGIN', scans: 145, createdAt: '2 days ago', status: 'active' },
    { id: '2', name: 'Doc Upload - Smith', purpose: 'DOCUMENT_UPLOAD', scans: 3, createdAt: '1 hour ago', status: 'active' },
    { id: '3', name: 'Event Registration', purpose: 'LOAN_APPLICATION', scans: 89, createdAt: '1 week ago', status: 'active' },
    { id: '4', name: 'Old Campaign', purpose: 'LOAN_APPLICATION', scans: 234, createdAt: '1 month ago', status: 'expired' },
  ]);

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    expired: 'bg-gray-100 text-gray-600',
    revoked: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Center</h1>
          <p className="text-gray-500 mt-1">Generate and manage QR codes for various purposes</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generate QR
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Total QR Codes</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{qrCodes.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Total Scans</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{qrCodes.reduce((sum, qr) => sum + qr.scans, 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Active Codes</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{qrCodes.filter(qr => qr.status === 'active').length}</p>
        </div>
      </div>

      {/* QR Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {qrCodes.map((qr, index) => {
          const purposeInfo = purposeLabels[qr.purpose];
          return (
            <motion.div
              key={qr.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{qr.name}</h3>
                    <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium bg-${purposeInfo?.color}-100 text-${purposeInfo?.color}-700`}>
                      {purposeInfo?.icon}
                      {purposeInfo?.label}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[qr.status]}`}>
                    {qr.status}
                  </span>
                </div>

                {/* QR Code Preview */}
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-800" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{qr.scans} scans</span>
                  <span className="text-gray-400">{qr.createdAt}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 p-3 bg-gray-50 flex items-center justify-between">
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-white rounded-lg transition-colors" title="View">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Copy Link">
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors" title="Download">
                    <Download className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QRCenterPage;


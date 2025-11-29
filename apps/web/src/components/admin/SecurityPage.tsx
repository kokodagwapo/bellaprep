import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Key,
  Smartphone,
  Fingerprint,
  Clock,
  Users,
  AlertTriangle,
  Check,
  ChevronRight,
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const [mfaSettings, setMfaSettings] = useState({
    smsEnabled: true,
    totpEnabled: true,
    webauthnEnabled: false,
    requiredForAdmins: true,
    requiredForAll: false,
  });

  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: 30,
    maxSessions: 5,
    rememberDevice: true,
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-500 mt-1">Configure authentication and security policies</p>
      </div>

      {/* MFA Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Multi-Factor Authentication</h2>
        </div>

        <div className="space-y-4">
          {/* MFA Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${mfaSettings.smsEnabled ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
              onClick={() => setMfaSettings({ ...mfaSettings, smsEnabled: !mfaSettings.smsEnabled })}>
              <div className="flex items-center justify-between mb-2">
                <Smartphone className={`w-5 h-5 ${mfaSettings.smsEnabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                {mfaSettings.smsEnabled && <Check className="w-5 h-5 text-emerald-600" />}
              </div>
              <h3 className="font-medium text-gray-900">SMS OTP</h3>
              <p className="text-sm text-gray-500 mt-1">Send codes via text message</p>
            </div>

            <div className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${mfaSettings.totpEnabled ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
              onClick={() => setMfaSettings({ ...mfaSettings, totpEnabled: !mfaSettings.totpEnabled })}>
              <div className="flex items-center justify-between mb-2">
                <Key className={`w-5 h-5 ${mfaSettings.totpEnabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                {mfaSettings.totpEnabled && <Check className="w-5 h-5 text-emerald-600" />}
              </div>
              <h3 className="font-medium text-gray-900">Authenticator App</h3>
              <p className="text-sm text-gray-500 mt-1">Google Authenticator, Authy</p>
            </div>

            <div className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${mfaSettings.webauthnEnabled ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
              onClick={() => setMfaSettings({ ...mfaSettings, webauthnEnabled: !mfaSettings.webauthnEnabled })}>
              <div className="flex items-center justify-between mb-2">
                <Fingerprint className={`w-5 h-5 ${mfaSettings.webauthnEnabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                {mfaSettings.webauthnEnabled && <Check className="w-5 h-5 text-emerald-600" />}
              </div>
              <h3 className="font-medium text-gray-900">Biometrics</h3>
              <p className="text-sm text-gray-500 mt-1">Face ID, Touch ID, Windows Hello</p>
            </div>
          </div>

          {/* MFA Requirements */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Require MFA for Admins</p>
                  <p className="text-sm text-gray-500">All admin users must enable MFA</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={mfaSettings.requiredForAdmins}
                onChange={(e) => setMfaSettings({ ...mfaSettings, requiredForAdmins: e.target.checked })}
                className="w-5 h-5 text-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Require MFA for All Users</p>
                  <p className="text-sm text-gray-500">All users including borrowers must enable MFA</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={mfaSettings.requiredForAll}
                onChange={(e) => setMfaSettings({ ...mfaSettings, requiredForAll: e.target.checked })}
                className="w-5 h-5 text-emerald-600 rounded"
              />
            </label>
          </div>
        </div>
      </motion.div>

      {/* Session Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Session Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <select
              value={sessionSettings.sessionTimeout}
              onChange={(e) => setSessionSettings({ ...sessionSettings, sessionTimeout: +e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Concurrent Sessions
            </label>
            <select
              value={sessionSettings.maxSessions}
              onChange={(e) => setSessionSettings({ ...sessionSettings, maxSessions: +e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value={1}>1 device</option>
              <option value={3}>3 devices</option>
              <option value={5}>5 devices</option>
              <option value={10}>10 devices</option>
              <option value={0}>Unlimited</option>
            </select>
          </div>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Remember Trusted Devices</p>
              <p className="text-sm text-gray-500">Skip MFA for recognized devices</p>
            </div>
            <input
              type="checkbox"
              checked={sessionSettings.rememberDevice}
              onChange={(e) => setSessionSettings({ ...sessionSettings, rememberDevice: e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded"
            />
          </label>
        </div>
      </motion.div>

      {/* Recent Security Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Security Events</h2>
          </div>
          <button className="text-sm text-emerald-600 font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { event: 'Failed login attempt', user: 'unknown@email.com', time: '5 mins ago', type: 'warning' },
            { event: 'MFA enabled', user: 'john@example.com', time: '1 hour ago', type: 'success' },
            { event: 'Password changed', user: 'sarah@example.com', time: '2 hours ago', type: 'info' },
            { event: 'New device login', user: 'mike@example.com', time: '1 day ago', type: 'info' },
          ].map((event, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'warning' ? 'bg-orange-500' :
                  event.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{event.event}</p>
                  <p className="text-sm text-gray-500">{event.user}</p>
                </div>
              </div>
              <span className="text-sm text-gray-400">{event.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityPage;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../../../components/ui/toast';

const SecuritySettings: React.FC = () => {
  const { showToast } = useToast();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaMethod, setMfaMethod] = useState<'totp' | 'sms' | 'email'>('totp');
  const [webauthnEnabled, setWebauthnEnabled] = useState(false);
  const [faceLoginEnabled, setFaceLoginEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  });

  return (
    <div className="p-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">Security & MFA</h1>
        <p className="text-base text-muted-foreground mb-8 font-light" style={{ color: '#6b7280' }}>
          Configure authentication methods and security policies
        </p>

        <div className="space-y-6">
          {/* Multi-Factor Authentication */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-light text-foreground">Multi-Factor Authentication</h2>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  Add an extra layer of security to user accounts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={(e) => setMfaEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            {mfaEnabled && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">MFA Method</label>
                  <div className="flex gap-4">
                    {[
                      { id: 'totp', label: 'TOTP (Authenticator App)', desc: 'Google Authenticator, Authy, etc.' },
                      { id: 'sms', label: 'SMS OTP', desc: 'One-time code via text message' },
                      { id: 'email', label: 'Email OTP', desc: 'One-time code via email' },
                    ].map((method) => (
                      <label key={method.id} className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mfaMethod"
                          value={method.id}
                          checked={mfaMethod === method.id}
                          onChange={() => setMfaMethod(method.id as any)}
                          className="mt-1"
                        />
                        <div>
                          <div className="text-sm font-light text-foreground">{method.label}</div>
                          <div className="text-xs text-muted-foreground font-light">{method.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* WebAuthn / Biometrics */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-light text-foreground">WebAuthn (Biometrics)</h2>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  Enable FaceID, TouchID, or security keys
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={webauthnEnabled}
                  onChange={(e) => setWebauthnEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Face Login */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-light text-foreground">Face Login</h2>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  Optional webcam-based face recognition login
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={faceLoginEnabled}
                  onChange={(e) => setFaceLoginEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Session Management */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-light text-foreground mb-4">Session Management</h2>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                min="5"
                max="480"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
              />
              <p className="text-xs text-muted-foreground mt-1.5 font-light">
                Users will be automatically logged out after this period of inactivity
              </p>
            </div>
          </div>

          {/* Password Policy */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-light text-foreground mb-4">Password Policy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Minimum Length</label>
                <input
                  type="number"
                  value={passwordPolicy.minLength}
                  onChange={(e) => setPasswordPolicy({ ...passwordPolicy, minLength: Number(e.target.value) })}
                  min="6"
                  max="32"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-light"
                />
              </div>
              <div className="space-y-2">
                {[
                  { key: 'requireUppercase', label: 'Require uppercase letters' },
                  { key: 'requireLowercase', label: 'Require lowercase letters' },
                  { key: 'requireNumbers', label: 'Require numbers' },
                  { key: 'requireSpecialChars', label: 'Require special characters' },
                ].map((req) => (
                  <label key={req.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={passwordPolicy[req.key as keyof typeof passwordPolicy] as boolean}
                      onChange={(e) => setPasswordPolicy({ ...passwordPolicy, [req.key]: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-primary/20"
                    />
                    <span className="text-sm font-light text-foreground">{req.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <motion.button
              onClick={() => showToast('Security settings saved successfully!', 'success')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-light transition-colors"
            >
              Save Security Settings
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecuritySettings;


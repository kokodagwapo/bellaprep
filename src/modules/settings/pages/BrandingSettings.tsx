import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../../../components/ui/toast';

const BrandingSettings: React.FC = () => {
  const { showToast } = useToast();
  const [brandColors, setBrandColors] = useState({
    primary: '#22c55e',
    secondary: '#3b82f6',
    accent: '#f59e0b'
  });
  const [logoUrl, setLogoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save branding
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('Branding settings saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save branding settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">Branding</h1>
        <p className="text-base text-muted-foreground mb-8 font-light" style={{ color: '#6b7280' }}>
          Customize your organization's visual identity, colors, and logo
        </p>

        <div className="space-y-8">
          {/* Logo Upload */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-light text-foreground mb-4">Logo</h2>
            <div className="flex items-center gap-6">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-20 w-auto object-contain" />
              ) : (
                <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No logo</span>
                </div>
              )}
              <div>
                <label className="block">
                  <span className="sr-only">Upload logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setLogoUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-light file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2 font-light">PNG, JPG or SVG. Max 2MB</p>
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-light text-foreground mb-4">Brand Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandColors.primary}
                    onChange={(e) => setBrandColors({ ...brandColors, primary: e.target.value })}
                    className="h-10 w-20 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandColors.primary}
                    onChange={(e) => setBrandColors({ ...brandColors, primary: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandColors.secondary}
                    onChange={(e) => setBrandColors({ ...brandColors, secondary: e.target.value })}
                    className="h-10 w-20 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandColors.secondary}
                    onChange={(e) => setBrandColors({ ...brandColors, secondary: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandColors.accent}
                    onChange={(e) => setBrandColors({ ...brandColors, accent: e.target.value })}
                    className="h-10 w-20 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandColors.accent}
                    onChange={(e) => setBrandColors({ ...brandColors, accent: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <h2 className="text-lg font-light text-foreground mb-4">Preview</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  L
                </div>
                <div className="flex-1">
                  <div className="h-2 rounded-full mb-1" style={{ backgroundColor: brandColors.primary, width: '60%' }} />
                  <div className="h-2 rounded-full" style={{ backgroundColor: brandColors.secondary, width: '40%' }} />
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-white font-light transition-colors"
                style={{ backgroundColor: brandColors.primary }}
              >
                Primary Button
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 font-light transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrandingSettings;


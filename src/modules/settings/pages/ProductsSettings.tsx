import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../../../components/ui/toast';

interface Product {
  id: string;
  name: string;
  enabled: boolean;
  propertyTypes: string[];
}

const ProductsSettings: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    { id: 'conventional', name: 'Conventional', enabled: true, propertyTypes: ['Single Family', 'Condo', 'Townhouse'] },
    { id: 'fha', name: 'FHA', enabled: true, propertyTypes: ['Single Family', 'Condo'] },
    { id: 'va', name: 'VA', enabled: true, propertyTypes: ['Single Family', 'Condo'] },
    { id: 'usda', name: 'USDA', enabled: false, propertyTypes: ['Single Family'] },
    { id: 'jumbo', name: 'Jumbo', enabled: true, propertyTypes: ['Single Family', 'Condo', 'Townhouse'] },
    { id: 'heloc', name: 'HELOC', enabled: false, propertyTypes: ['Single Family', 'Condo', 'Townhouse'] },
    { id: 'nonqm', name: 'Non-QM', enabled: false, propertyTypes: ['Single Family', 'Condo'] },
    { id: 'mobile', name: 'Mobile Home', enabled: false, propertyTypes: ['Mobile Home'] },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const toggleProduct = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save products
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast('Product settings saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save product settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-light text-foreground mb-2 tracking-tight">Products & Eligibility Matrix</h1>
        <p className="text-base text-muted-foreground mb-8 font-light" style={{ color: '#6b7280' }}>
          Configure loan products and their eligibility requirements
        </p>

        <div className="space-y-6">
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: products.indexOf(product) * 0.05 }}
                className={`bg-white rounded-xl border p-6 shadow-sm transition-all ${
                  product.enabled ? 'border-primary/30' : 'border-gray-200/80 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-light text-foreground">{product.name}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={product.enabled}
                      onChange={() => toggleProduct(product.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Property Types</p>
                  <div className="flex flex-wrap gap-2">
                    {product.propertyTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md font-light"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-light">
              <strong className="font-medium">Note:</strong> Enabled products will appear in borrower flows and form builders. 
              Property types and eligibility rules can be configured per product.
            </p>
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

export default ProductsSettings;


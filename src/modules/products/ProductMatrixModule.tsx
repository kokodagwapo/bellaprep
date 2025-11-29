import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  propertyTypes: string[];
  minLoanAmount: number;
  maxLoanAmount: number;
  minCreditScore: number;
  maxDTI: number;
  requiredDocs: string[];
}

const defaultProducts: Product[] = [
  {
    id: 'conventional',
    name: 'Conventional',
    description: 'Standard conforming loans backed by Fannie Mae/Freddie Mac',
    enabled: true,
    propertyTypes: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family (2-4)'],
    minLoanAmount: 50000,
    maxLoanAmount: 766550,
    minCreditScore: 620,
    maxDTI: 50,
    requiredDocs: ['W-2', 'Pay Stubs', 'Bank Statements', 'Tax Returns'],
  },
  {
    id: 'fha',
    name: 'FHA',
    description: 'Federal Housing Administration insured loans',
    enabled: true,
    propertyTypes: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family (2-4)'],
    minLoanAmount: 50000,
    maxLoanAmount: 472030,
    minCreditScore: 580,
    maxDTI: 57,
    requiredDocs: ['W-2', 'Pay Stubs', 'Bank Statements', 'Tax Returns'],
  },
  {
    id: 'va',
    name: 'VA',
    description: 'Veterans Affairs guaranteed loans',
    enabled: true,
    propertyTypes: ['Single Family', 'Condo', 'Townhouse'],
    minLoanAmount: 50000,
    maxLoanAmount: 766550,
    minCreditScore: 580,
    maxDTI: 60,
    requiredDocs: ['W-2', 'Pay Stubs', 'Bank Statements', 'DD-214', 'COE'],
  },
  {
    id: 'usda',
    name: 'USDA',
    description: 'Rural development loans',
    enabled: false,
    propertyTypes: ['Single Family'],
    minLoanAmount: 50000,
    maxLoanAmount: 500000,
    minCreditScore: 640,
    maxDTI: 41,
    requiredDocs: ['W-2', 'Pay Stubs', 'Bank Statements', 'Tax Returns'],
  },
  {
    id: 'jumbo',
    name: 'Jumbo',
    description: 'Non-conforming loans exceeding conventional limits',
    enabled: true,
    propertyTypes: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family (2-4)'],
    minLoanAmount: 766551,
    maxLoanAmount: 3000000,
    minCreditScore: 700,
    maxDTI: 43,
    requiredDocs: ['W-2', 'Pay Stubs', 'Bank Statements', 'Tax Returns', 'Asset Documentation'],
  },
];

const ProductMatrixModule: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [saveMessage, setSaveMessage] = useState<string>('');

  const toggleProduct = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, ...updates } : p
    ));
    if (selectedProduct?.id === productId) {
      setSelectedProduct({ ...selectedProduct, ...updates });
    }
  };

  const handleSave = () => {
    setSaveMessage('Product matrix saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Product & Eligibility Matrix</h1>
          <p className="mt-1 text-gray-500">Configure loan products, eligibility criteria, and documentation.</p>
        </div>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </header>

      {saveMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{saveMessage}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Available Products</h2>
          <div className="space-y-2">
            {products.map(product => (
              <div
                key={product.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedProduct?.id === product.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleProduct(product.id); }}
                      className={`w-12 h-6 rounded-full transition-colors relative ${product.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${product.enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.enabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedProduct ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h2>
                  <p className="text-gray-500">{selectedProduct.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedProduct.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {selectedProduct.enabled ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Loan Amount</label>
                  <input type="number" value={selectedProduct.minLoanAmount} onChange={(e) => updateProduct(selectedProduct.id, { minLoanAmount: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Loan Amount</label>
                  <input type="number" value={selectedProduct.maxLoanAmount} onChange={(e) => updateProduct(selectedProduct.id, { maxLoanAmount: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Credit Score</label>
                  <input type="number" value={selectedProduct.minCreditScore} onChange={(e) => updateProduct(selectedProduct.id, { minCreditScore: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max DTI (%)</label>
                  <input type="number" value={selectedProduct.maxDTI} onChange={(e) => updateProduct(selectedProduct.id, { maxDTI: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eligible Property Types</label>
                <div className="flex flex-wrap gap-2">
                  {['Single Family', 'Condo', 'Townhouse', 'Multi-Family (2-4)'].map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        const newTypes = selectedProduct.propertyTypes.includes(type)
                          ? selectedProduct.propertyTypes.filter(t => t !== type)
                          : [...selectedProduct.propertyTypes, type];
                        updateProduct(selectedProduct.id, { propertyTypes: newTypes });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm ${selectedProduct.propertyTypes.includes(type) ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-semibold text-gray-900">${(selectedProduct.minLoanAmount / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-500">Min Loan</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-semibold text-gray-900">${(selectedProduct.maxLoanAmount / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-500">Max Loan</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-semibold text-gray-900">{selectedProduct.minCreditScore}</p>
                    <p className="text-xs text-gray-500">Min Score</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Product</h3>
              <p className="text-gray-500">Click on a product from the list to view and edit its configuration.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductMatrixModule;

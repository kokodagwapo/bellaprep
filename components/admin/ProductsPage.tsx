import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Edit,
  ToggleLeft,
  ToggleRight,
  Settings2,
  DollarSign,
  Percent,
  Home,
  FileCheck,
} from 'lucide-react';

interface LoanProduct {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
  eligibility: {
    minLoanAmount: number;
    maxLoanAmount: number;
    minCreditScore: number;
    maxDti: number;
    maxLtv: number;
    allowedPropertyTypes: string[];
    allowedOccupancyTypes: string[];
  };
  loanCount: number;
}

interface ProductsPageProps {
  products?: LoanProduct[];
  onToggleActive?: (id: string) => void;
  onEditProduct?: (id: string) => void;
}

const productTypeColors: Record<string, string> = {
  CONVENTIONAL: 'bg-blue-100 text-blue-700',
  FHA: 'bg-emerald-100 text-emerald-700',
  VA: 'bg-purple-100 text-purple-700',
  USDA: 'bg-orange-100 text-orange-700',
  JUMBO: 'bg-pink-100 text-pink-700',
  HELOC: 'bg-cyan-100 text-cyan-700',
  NON_QM: 'bg-amber-100 text-amber-700',
};

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products = [
    {
      id: '1',
      name: 'Conventional 30-Year Fixed',
      type: 'CONVENTIONAL',
      description: 'Standard conventional loan with fixed rate',
      isActive: true,
      eligibility: {
        minLoanAmount: 50000,
        maxLoanAmount: 726200,
        minCreditScore: 620,
        maxDti: 43,
        maxLtv: 97,
        allowedPropertyTypes: ['SINGLE_FAMILY', 'CONDO', 'TOWNHOUSE'],
        allowedOccupancyTypes: ['PRIMARY_RESIDENCE', 'SECOND_HOME', 'INVESTMENT'],
      },
      loanCount: 45,
    },
    {
      id: '2',
      name: 'FHA 30-Year Fixed',
      type: 'FHA',
      description: 'Government-backed loan with lower down payment',
      isActive: true,
      eligibility: {
        minLoanAmount: 50000,
        maxLoanAmount: 472030,
        minCreditScore: 580,
        maxDti: 50,
        maxLtv: 96.5,
        allowedPropertyTypes: ['SINGLE_FAMILY', 'CONDO', 'TOWNHOUSE', 'MULTI_FAMILY_2_4'],
        allowedOccupancyTypes: ['PRIMARY_RESIDENCE'],
      },
      loanCount: 28,
    },
    {
      id: '3',
      name: 'VA 30-Year Fixed',
      type: 'VA',
      description: 'Loan for eligible veterans and service members',
      isActive: true,
      eligibility: {
        minLoanAmount: 50000,
        maxLoanAmount: 726200,
        minCreditScore: 620,
        maxDti: 41,
        maxLtv: 100,
        allowedPropertyTypes: ['SINGLE_FAMILY', 'CONDO', 'TOWNHOUSE'],
        allowedOccupancyTypes: ['PRIMARY_RESIDENCE'],
      },
      loanCount: 15,
    },
    {
      id: '4',
      name: 'Jumbo Fixed',
      type: 'JUMBO',
      description: 'For loan amounts exceeding conforming limits',
      isActive: false,
      eligibility: {
        minLoanAmount: 726201,
        maxLoanAmount: 3000000,
        minCreditScore: 700,
        maxDti: 43,
        maxLtv: 80,
        allowedPropertyTypes: ['SINGLE_FAMILY', 'CONDO'],
        allowedOccupancyTypes: ['PRIMARY_RESIDENCE', 'SECOND_HOME'],
      },
      loanCount: 8,
    },
  ],
  onToggleActive,
  onEditProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Configure loan products and eligibility rules</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Product Header */}
            <div
              className="p-6 cursor-pointer"
              onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${product.isActive ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                    <Package className={`w-6 h-6 ${product.isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${productTypeColors[product.type]}`}>
                        {product.type}
                      </span>
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <p className="text-sm text-gray-500">Active Loans</p>
                    <p className="text-lg font-semibold text-gray-900">{product.loanCount}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleActive?.(product.id);
                    }}
                    className="p-2"
                  >
                    {product.isActive ? (
                      <ToggleRight className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProduct?.(product.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Settings2 className="w-5 h-5 text-gray-500" />
                  </button>
                  {expandedProduct === product.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedProduct === product.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-100 overflow-hidden"
                >
                  <div className="p-6 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Eligibility Requirements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-xs font-medium">Loan Amount</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(product.eligibility.minLoanAmount)} - {formatCurrency(product.eligibility.maxLoanAmount)}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <FileCheck className="w-4 h-4" />
                          <span className="text-xs font-medium">Min Credit Score</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {product.eligibility.minCreditScore}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Percent className="w-4 h-4" />
                          <span className="text-xs font-medium">Max DTI / LTV</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {product.eligibility.maxDti}% / {product.eligibility.maxLtv}%
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Home className="w-4 h-4" />
                          <span className="text-xs font-medium">Property Types</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {product.eligibility.allowedPropertyTypes.length} types
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.eligibility.allowedPropertyTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600"
                        >
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.eligibility.allowedOccupancyTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-emerald-50 border border-emerald-100 rounded text-xs text-emerald-700"
                        >
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;


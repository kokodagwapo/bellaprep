import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api';
import type { Product } from '../../../lib/api/types';

const ProductMatrix: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.get<Product[]>('/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleProduct = async (productId: string, enabled: boolean) => {
    try {
      await apiClient.patch(`/products/${productId}`, { enabled });
      setProducts(products.map(p => p.id === productId ? { ...p, enabled } : p));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product & Eligibility Matrix</h1>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  Property Types: {Array.isArray(product.propertyTypes) ? product.propertyTypes.join(', ') : 'N/A'}
                </p>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={product.enabled}
                  onChange={(e) => toggleProduct(product.id, e.target.checked)}
                  className="w-5 h-5"
                />
                <span>Enabled</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMatrix;


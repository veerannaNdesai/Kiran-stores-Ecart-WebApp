'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  const fetchProducts = async () => {
    const res = await fetch('/api/products?all=true');
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  const updateAvailability = async (product: any, newAvailable: number) => {
    await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, available: newAvailable })
    });
    fetchProducts();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Product Inventory</h2>
        <button className="btn-primary" style={{ width: 'auto' }} onClick={() => { setIsEditing(true); setCurrentProduct({ name: '', price: '', category: 'Grocery', available: 1, stock_quantity: 10, image_url: '' }); }}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Product</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={product.image_url} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover', background: '#f1f5f9' }} />
                  <span style={{ fontWeight: 500 }}>{product.name}</span>
                </td>
                <td style={{ padding: '1rem', color: '#64748b' }}>{product.category}</td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>₹{product.price}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    fontWeight: 700, 
                    color: product.stock_quantity <= 0 ? '#ef4444' : product.stock_quantity < 5 ? '#f59e0b' : '#64748b',
                    fontSize: '0.875rem'
                  }}>
                    {product.stock_quantity}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {product.available ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#ef4444" />}
                    <select
                      value={product.available}
                      onChange={(e) => updateAvailability(product, parseInt(e.target.value))}
                      style={{
                        padding: '0.375rem 0.5rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        background: 'white',
                        color: product.available ? '#10b981' : '#ef4444',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value={1} style={{ color: '#10b981' }}>Available</option>
                      <option value={0} style={{ color: '#ef4444' }}>Not Available</option>
                    </select>
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button style={{ color: '#64748b', marginRight: '1rem' }} onClick={() => { setCurrentProduct(product); setIsEditing(true); }}>
                    <Edit2 size={18} />
                  </button>
                  <button style={{ color: '#ef4444' }} onClick={() => handleDelete(product.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: 400, width: '100%' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                placeholder="Product Name" 
                value={currentProduct.name} 
                onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="number" 
                  placeholder="Price" 
                  value={currentProduct.price} 
                  onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                />
                <input 
                  type="number" 
                  placeholder="Stock" 
                  value={currentProduct.stock_quantity} 
                  onChange={e => setCurrentProduct({...currentProduct, stock_quantity: parseInt(e.target.value)})}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                />
              </div>
              <select 
                value={currentProduct.category} 
                onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
              >
                {['Grocery', 'Dairy', 'Vegetables', 'Snacks', 'Household', 'Personal Care'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input 
                placeholder="Image URL" 
                value={currentProduct.image_url} 
                onChange={e => setCurrentProduct({...currentProduct, image_url: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={async () => {
                   const method = currentProduct.id ? 'PUT' : 'POST';
                   const url = currentProduct.id ? `/api/products/${currentProduct.id}` : '/api/products';
                   await fetch(url, {
                     method,
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(currentProduct)
                   });
                   setIsEditing(false);
                   fetchProducts();
                }}>Save</button>
                <button className="btn-primary" style={{ flex: 1, background: '#e2e8f0', color: '#475569' }} onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

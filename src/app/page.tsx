'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Home, User, Package, Plus, Minus } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { addToCart, cart, updateQuantity } = useCart();

  const categories = ['All', 'Grocery', 'Dairy', 'Vegetables', 'Snacks', 'Household', 'Personal Care'];

  useEffect(() => {
    fetch(`/api/products?category=${category}&search=${search}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [category, search]);

  return (
    <div className="pb-24">
      <Header />

      <main className="container">
        {/* Banner */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #2563eb, #10b981)', 
          color: 'white', 
          marginBottom: '1.5rem',
          padding: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Local Grocery Delivered Fast</h2>
          <p style={{ opacity: 0.9 }}>Order fresh vegetables, dairy, and household essentials from Kiran Stores.</p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`category-pill ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <h3 className="section-title">{category === 'All' ? 'Our Products' : category}</h3>

        {/* Products Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
          gap: '1rem' 
        }}>
          {products.map(product => {
            const cartItem = cart.find(item => item.id === product.id);
            return (
              <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ width: '100%', aspectRatio: '1/1', background: '#f1f5f9', borderRadius: 'calc(var(--radius) - 4px)', overflow: 'hidden' }}>
                  <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', height: '2.5rem', overflow: 'hidden' }}>{product.name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{product.price}</span>
                  {product.stock_quantity <= 0 ? (
                    <span style={{ 
                      background: '#fee2e2', 
                      color: '#ef4444', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700 
                    }}>
                      Out of Stock
                    </span>
                  ) : cartItem ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      background: '#f1f5f9', 
                      borderRadius: '999px', 
                      padding: '0.25rem 0.5rem',
                      border: '1px solid var(--border)'
                    }}>
                      <button 
                        onClick={() => updateQuantity(product.id, -1)} 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', minWidth: 20, textAlign: 'center' }}>{cartItem.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(product.id, 1)} 
                        disabled={cartItem.quantity >= product.stock_quantity}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          width: 24, 
                          height: 24,
                          opacity: cartItem.quantity >= product.stock_quantity ? 0.3 : 1
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      {product.stock_quantity < 5 && (
                        <span style={{ fontSize: '0.625rem', color: '#f59e0b', fontWeight: 700 }}>Only {product.stock_quantity} left!</span>
                      )}
                      <button 
                        onClick={() => addToCart(product)}
                        style={{ 
                          background: 'var(--primary)', 
                          color: 'white', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                        }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Navbar />
    </div>
  );
}

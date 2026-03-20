'use client';

import React from 'react';
import { ChevronLeft, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Add some items from the store to get started.</p>
          <Link href="/" className="btn-primary">Go to Store</Link>
        </div>
        <Navbar />
      </>
    );
  }

  return (
    <div className="pb-24">
      <Header />

      <main className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {cart.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>{item.name}</p>
                <p style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.price}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f1f5f9', borderRadius: '999px', padding: '0.25rem 0.5rem' }}>
                <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: 4 }}><Minus size={16} /></button>
                <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: 4 }}><Plus size={16} /></button>
              </div>

              <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', padding: 4 }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '2rem', background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Delivery</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary)' }}>₹{total}</span>
          </div>
        </div>

        <Link href="/checkout" className="btn-primary" style={{ marginTop: '2rem' }}>
          Proceed to Checkout
          <ArrowRight size={20} />
        </Link>
      </main>
      <Navbar />
    </div>
  );
}

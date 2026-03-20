'use client';

import React, { useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  React.useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setFormData({
            name: data.user.name,
            phone: data.user.phone,
            address: data.user.address || ''
          });
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          items: cart
        })
      });

      if (res.ok) {
        clearCart();
        router.push('/confirmation');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24">
      <Header />

      <main className="container">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Delivery Details</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
              <input 
                required
                type="text" 
                placeholder="Enter your name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Phone Number</label>
              <input 
                required
                type="tel" 
                placeholder="Enter 10-digit number"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
              />
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Delivery Address</label>
              <textarea 
                required
                rows={3}
                placeholder="House no, Street, Landmark..."
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--foreground)', fontSize: '1rem' }}>
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
            By placing the order, you agree to Kiran Stores' delivery terms.
          </p>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : 'Place Order'}
            {!loading && <Send size={20} />}
          </button>
        </form>
      </main>
      <Navbar />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/dist/client/link';
import { Search, Package, Clock, CheckCircle, Truck, ChevronLeft, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';

export default function TrackOrdersPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/track?phone=${phone}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setSearched(true);
    } catch (error) {
      console.error('Track error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New Order': return <ShoppingBag size={20} color="#3b82f6" />;
      case 'Preparing': return <Clock size={20} color="#f59e0b" />;
      case 'Delivered': return <CheckCircle size={20} color="#10b981" />;
      default: return <Package size={20} />;
    }
  };

  return (
    <div className="pb-24">
      <Header />

      <main className="container">
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Enter your Phone Number</h2>
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="search-input"
              style={{ 
                flex: 1, 
                padding: '0.75rem 1rem', 
                borderRadius: 'var(--radius)', 
                border: '1px solid var(--border)',
                fontSize: '1rem'
              }}
              required
            />
            <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={loading}>
              <Search size={20} />
              {loading ? 'Finding...' : 'Track'}
            </button>
          </form>
        </div>

        {searched && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <Package size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3>No orders found</h3>
            <p style={{ color: '#64748b' }}>We couldn't find any orders for this phone number.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div key={order.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>Order #{order.id}</span>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      background: '#f1f5f9', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {getStatusIcon(order.order_status)}
                      {order.order_status}
                    </span>
                  </div>
                  <small style={{ color: '#64748b' }}>
                    {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.25rem' }}>₹{order.total_amount}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {order.items.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#475569' }}>
                      {item.quantity}x {item.product_name}
                    </span>
                    <span style={{ fontWeight: 500 }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#1e293b' }}>Delivery Details</div>
                <div style={{ color: '#64748b' }}>{order.customer_name} • {order.phone}</div>
                <div style={{ color: '#64748b' }}>{order.address}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Navbar />
    </div>
  );
}

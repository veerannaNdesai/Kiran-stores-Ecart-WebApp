'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Package, User, MapPin, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => (o.id === id ? { ...o, order_status: newStatus } : o)));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Network error while updating status');
    }
  };

  const statuses = ['New Order', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading orders...</div>;

  return (
    <div className="pb-24">
      <header>
        <div className="header-content">
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
            <ChevronLeft size={20} />
            Dashboard
          </Link>
          <h1 style={{ fontSize: '1.25rem' }}>Manage Orders</h1>
          <div style={{ width: 24 }}></div>
        </div>
      </header>

      <main className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={20} color="var(--primary)" />
                  <span style={{ fontWeight: 700 }}>Order #{order.id}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Customer Details</h4>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    <User size={16} /> {order.customer_name}
                  </p>
                  <p style={{ fontSize: '0.875rem', marginLeft: '1.5rem', marginBottom: '0.5rem' }}>Phone: {order.phone}</p>
                  <p style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    {order.address}
                  </p>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Order Items</h4>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{order.items}</p>
                  <div style={{ display: 'inline-flex', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '4px', fontWeight: 700, color: '#0f172a' }}>
                    Total: ₹{order.total_amount}
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#64748b' }}>
                  <Truck size={18} />
                  Status:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(order.id, status)}
                      style={{
                        padding: '0.375rem 0.875rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: order.order_status === status ? '1px solid transparent' : '1px solid var(--border)',
                        background: order.order_status === status ? 'var(--primary)' : 'white',
                        color: order.order_status === status ? 'white' : '#64748b',
                        cursor: order.order_status === status ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
              <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3>No orders yet</h3>
              <p>When customers place orders, they will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

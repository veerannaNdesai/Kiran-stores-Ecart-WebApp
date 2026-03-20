'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Package, MapPin, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const userRes = await fetch('/api/auth/me');
        const userData = await userRes.json();
        
        if (!userRes.ok) {
          router.push('/login');
          return;
        }
        
        setUser(userData.user);
        
        // Fetch user's orders (will implement internal filtering in API later)
        const orderRes = await fetch('/api/orders');
        const orderData = await orderRes.json();
        // For simplicity now, filter by phone as customer_id migration is internal
        const userOrders = orderData.filter((o: any) => o.phone === userData.user.phone);
        setOrders(userOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    dataFetch();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' });
    router.push('/');
    router.refresh();
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div className="pb-24">
      <header>
        <div className="header-content">
          <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>My Account</h1>
          <button onClick={handleLogout} style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="container">
        {user && (
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'linear-gradient(to right, #eff6ff, #f8fafc)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem' }}>{user.name}</h2>
                <p style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                  <Phone size={14} /> {user.phone}
                </p>
              </div>
            </div>
            {user.address && (
              <div style={{ display: 'flex', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                <MapPin size={16} />
                <p>{user.address}</p>
              </div>
            )}
          </div>
        )}

        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={20} color="var(--primary)" /> My Order History
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Order #{order.id}</span>
                <span style={{ 
                  background: order.order_status === 'Delivered' ? '#ecfdf5' : '#fff7ed', 
                  color: order.order_status === 'Delivered' ? '#10b981' : '#f59e0b',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {order.order_status}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{order.items}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                <span style={{ fontWeight: 700 }}>₹{order.total_amount}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p>You haven't placed any orders yet.</p>
            </div>
          )}
        </div>
      </main>

      <Navbar />
    </div>
  );
}

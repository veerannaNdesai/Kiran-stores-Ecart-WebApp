'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    newOrders: 0
  });

  useEffect(() => {
    // Fetch stats - combining multiple API calls or sharing data
    const fetchStats = async () => {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products')
      ]);
      const orders = await ordersRes.json();
      const products = await productsRes.json();

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue: orders.reduce((sum: number, o: any) => sum + o.total_amount, 0),
        newOrders: orders.filter((o: any) => o.order_status === 'New Order').length
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: '#2563eb' },
    { name: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: TrendingUp, color: '#10b981' },
    { name: 'Active Products', value: stats.totalProducts, icon: Package, color: '#f59e0b' },
    { name: 'New Orders', value: stats.newOrders, icon: Users, color: '#ef4444' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Welcome, Shop Owner</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {statCards.map(stat => (
          <div key={stat.name} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>{stat.name}</p>
                <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{stat.value}</h3>
              </div>
              <div style={{ background: stat.color + '15', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
                <stat.icon size={24} color={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/admin/products" className="btn-primary">Update Prices</Link>
            <Link href="/admin/orders" className="btn-primary" style={{ background: '#f1f5f9', color: '#1e293b' }}>View All Orders</Link>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>You have {stats.newOrders} new orders waiting to be prepared.</p>
        </div>
      </div>
    </div>
  );
}

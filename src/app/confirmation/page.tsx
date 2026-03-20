'use client';

import React from 'react';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ background: '#ecfdf5', padding: '2rem', borderRadius: '50%' }}>
        <CheckCircle size={64} color="#10b981" />
      </div>
      
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Order Placed!</h2>
        <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Your order has been placed successfully.</p>
        <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Kiran Stores will deliver shortly.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginTop: '2rem' }}>
        <Link href="/" className="btn-primary">
          <Home size={20} />
          Back to Home
        </Link>
        <Link href="/track" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#64748b', fontWeight: 600 }}>
          <ShoppingBag size={20} />
          View Order History
        </Link>
      </div>
    </div>
  );
}

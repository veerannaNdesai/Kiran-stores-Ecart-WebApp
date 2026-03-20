'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';

export default function Header() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header>
      <div className="header-content">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img 
            src="/logo.png" 
            alt="Kiran Stores" 
            style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: '8px' }} 
          />
          <h1 style={{ 
            color: 'var(--primary)', 
            fontSize: '1.5rem', 
            fontWeight: 800,
            marginBottom: 0,
            letterSpacing: '-0.025em'
          }}>
            Kiran Stores
          </h1>
        </Link>
        <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <ShoppingCart size={24} color="var(--primary)" />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -8,
              right: -8,
              background: 'var(--accent)',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

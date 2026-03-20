'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  // If we are on the login page, just show the content without the layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state to prevent flash of content
  if (isAuthorized === null) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center', background: '#f1f5f9' }}></div>;
  }

  if (isAuthorized === false) {
    return null; // Redirecting
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Manage Products', href: '/admin/products', icon: Package },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: 'white', borderRight: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img 
            src="/logo.png" 
            alt="Kiran Stores" 
            style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: '4px' }} 
          />
          <div>
            <h1 style={{ 
              color: 'var(--primary)', 
              fontSize: '1.25rem', 
              fontWeight: 800,
              margin: 0,
              lineHeight: 1
            }}>
              Kiran Stores
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Admin Panel</p>
          </div>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => (
            <Link 
              key={item.href} 
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius)',
                color: pathname === item.href ? 'white' : '#475569',
                background: pathname === item.href ? 'var(--primary)' : 'transparent',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#64748b', fontWeight: 600 }}>
            <ChevronLeft size={20} />
            Back to Shop
          </Link>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#ef4444', fontWeight: 600, width: '100%', textAlign: 'left' }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, ShoppingBag, User, Search, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Track', href: '/track', icon: Search },
    { name: user ? 'Profile' : 'Login', href: user ? '/profile' : '/login', icon: user ? User : LogIn },
    ...(user?.is_admin ? [{ name: 'Admin', href: '/admin', icon: ShoppingBag }] : []),
  ];

  return (
    <nav className="nav-bottom">
      {navItems.map(item => (
        <Link 
          key={item.href} 
          href={item.href} 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            color: pathname === item.href ? 'var(--primary)' : '#64748b',
            textDecoration: 'none'
          }}
        >
          <item.icon size={20} />
          <span style={{ fontSize: 10, marginTop: 4 }}>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}

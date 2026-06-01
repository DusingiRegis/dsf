'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/properties', label: 'Properties' },
    { href: '/admin/inquiries', label: 'Inquiries' },
  ];

  return (
    <aside className="w-64 bg-admin-card border-r border-gray-700 p-6">
      <div className="mb-8">
        <Link href="/" className="font-serif text-2xl font-bold text-accent">
          EstateHub
        </Link>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

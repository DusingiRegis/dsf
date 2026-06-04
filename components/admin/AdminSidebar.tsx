'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ORIGINAL_ADMIN_EMAIL = 'admin@defrealestate.com';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Properties', href: '/admin/properties', icon: '🏠' },
    { name: 'Inquiries', href: '/admin/inquiries', icon: '📩' },
    { name: 'Activity', href: '/admin/activity', icon: '📈' },
    ...(session?.user?.email === ORIGINAL_ADMIN_EMAIL
      ? [{ name: 'Register Admin', href: '/admin/register', icon: '👤' }]
      : []),
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-[#0B1F3A] text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C9A84C] rounded-lg flex items-center justify-center font-bold text-xl">
            D
          </div>
          <span className="font-bold text-lg">D.E.F Admin</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#C9A84C] text-[#0B1F3A]'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Link
          href="/admin/login"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-all"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
}

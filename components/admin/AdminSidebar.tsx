'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Properties', href: '/admin/properties', icon: '🏠' },
    { name: 'Property Submissions', href: '/admin/property-submissions', icon: '📝' },
    { name: 'Inquiries', href: '/admin/inquiries', icon: '📩' },
    { name: 'Activity', href: '/admin/activity', icon: '📈' },
    ...(session?.user?.isSuperAdmin
      ? [
          { name: 'Manage Admins', href: '/admin/manage-admins', icon: '👥' },
          { name: 'Register Admin', href: '/admin/register', icon: '👤' },
        ]
      : []),
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Image
            src="/logo6.png"
            alt="D.E.F Admin Logo"
            width={40}
            height={40}
            className="rounded-lg object-contain"
          />
          <span className="font-bold text-lg">D.E.F Admin</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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

      <div className="p-4 border-t border-slate-700 flex flex-col gap-2 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-all"
        >
          <span className="text-xl">🏠</span>
          <span className="font-medium">Return to Home</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-all w-full text-left"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0B1F3A] text-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo6.png"
            alt="D.E.F Admin Logo"
            width={32}
            height={32}
            className="rounded-lg object-contain"
          />
          <span className="font-bold">D.E.F Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-2xl p-2 rounded-lg hover:bg-slate-800 transition-all"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-[#0B1F3A] text-white z-50 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0B1F3A] text-white flex flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}

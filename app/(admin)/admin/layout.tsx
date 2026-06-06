'use client';

import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Dashboard - D.E.F Real Estate',
  description: 'Manage properties and inquiries for D.E.F Real Estate',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar />
      <div className="flex-1 pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
}

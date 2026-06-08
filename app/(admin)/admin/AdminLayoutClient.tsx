'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0B1F3A]">
        {children}
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

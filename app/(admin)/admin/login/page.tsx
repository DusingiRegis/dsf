'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login: just redirect to admin
    router.push('/admin');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-admin-bg">
      <div className="bg-admin-card p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="font-serif text-3xl font-bold text-white mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input type="email" defaultValue="admin@estatehub.com" className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input type="password" defaultValue="admin123" className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white" />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </div>
    </main>
  );
}

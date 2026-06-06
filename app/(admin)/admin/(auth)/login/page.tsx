'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formVisible, setFormVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in redirect to dashboard
    if (status === 'authenticated') {
      router.push('/admin/activity');
      return;
    }

    // Show form immediately
    if (status === 'unauthenticated') {
      setFormVisible(true);
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid credentials');
      }

      // Redirect to admin dashboard on success
      router.push('/admin/activity');
      router.refresh();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-admin-bg">
      <div className="bg-admin-card p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="font-serif text-3xl font-bold text-white mb-2 text-center">Admin Access</h1>
        <p className="text-gray-400 text-center text-sm mb-6">Restricted area</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* FORM — only visible when formVisible is true */}
          {formVisible ? (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
                  placeholder="Enter your email"
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-700 rounded-lg px-4 py-2 pr-16 bg-gray-900 text-white"
                    placeholder="Enter your password"
                    autoComplete="off"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" theme="admin" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </>
          ) : (
            // Show nothing / spinner while form is hidden
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

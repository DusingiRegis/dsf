'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch existing admin users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/register');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Admin user added successfully!' });
        setNewEmail('');
        setNewPassword('');
        // Refresh user list
        const userResponse = await fetch('/api/admin/register');
        if (userResponse.ok) {
          const data = await userResponse.json();
          setUsers(data);
        }
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to add admin user' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-white mb-8">Admin Settings</h1>

        {/* Add New Admin Section */}
        <div className="bg-admin-card rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Administrator</h2>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            {message && (
              <div
                className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-900/50 border border-green-500 text-green-200' : 'bg-red-900/50 border border-red-500 text-red-200'}`}
              >
                {message.text}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Administrator'}
            </Button>
          </form>
        </div>

        {/* Existing Admins Section */}
        <div className="bg-admin-card rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Existing Administrators</h2>
          {users.length === 0 ? (
            <p className="text-gray-400">No admin users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-300">Email</th>
                    <th className="text-left py-2 text-gray-300">Role</th>
                    <th className="text-left py-2 text-gray-300">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800">
                      <td className="py-3 text-white">{user.email}</td>
                      <td className="py-3 text-gray-300">{user.role}</td>
                      <td className="py-3 text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type User = {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  isSuperAdmin: boolean;
  createdAt: string;
};

export default function ClientManageAdmins() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/register');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to load admin users', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuperAdmin = async (user: User) => {
    if (!confirm(`Are you sure you want to ${user.isSuperAdmin ? 'remove' : 'grant'} super admin privileges?`)) return;
    
    try {
      const res = await fetch('/api/admin/register', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, isSuperAdmin: !user.isSuperAdmin }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update admin');
      }
      setMessage({ text: 'Admin updated successfully!', type: 'success' });
      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage({ text: error instanceof Error ? error.message : 'Failed to update admin', type: 'error' });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      const res = await fetch(`/api/admin/register?id=${userId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete admin');
      }
      setMessage({ text: 'Admin deleted successfully!', type: 'success' });
      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage({ text: error instanceof Error ? error.message : 'Failed to delete admin', type: 'error' });
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      const res = await fetch('/api/admin/register', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUser.id, password: newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reset password');
      }
      setMessage({ text: `Password reset successfully for ${selectedUser.email}!`, type: 'success' });
      setResetModalOpen(false);
      setSelectedUser(null);
      setNewPassword('');
    } catch (error) {
      console.error(error);
      setMessage({ text: error instanceof Error ? error.message : 'Failed to reset password', type: 'error' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A]">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-8">Manage Admins</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Super Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {user.name || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {user.isSuperAdmin ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {user.id === session?.user?.id ? (
                      <span className="text-slate-400">Current User</span>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setResetModalOpen(true);
                          }}
                          className="px-3 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200"
                        >
                          Reset Password
                        </button>
                        <button
                          onClick={() => handleToggleSuperAdmin(user)}
                          className={`px-3 py-1 rounded text-xs font-medium ${user.isSuperAdmin ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                        >
                          {user.isSuperAdmin ? 'Remove Super' : 'Make Super'}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Password Modal */}
      {resetModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#0B1F3A] mb-4">
              Reset Password for {selectedUser.email}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent outline-none"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setResetModalOpen(false);
                    setSelectedUser(null);
                    setNewPassword('');
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={!newPassword}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#C9A84C] text-white hover:bg-[#b89744] disabled:opacity-50"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
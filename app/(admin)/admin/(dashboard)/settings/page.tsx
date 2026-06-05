'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const ORIGINAL_ADMIN_EMAIL = 'admin@defrealestate.com';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminSettings() {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserMessage, setAddUserMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/register');
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email === ORIGINAL_ADMIN_EMAIL) {
      fetchUsers();
    }
  }, [session]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ text: 'New password must be at least 6 characters', type: 'error' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordMessage({ text: data.message, type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage({ text: error instanceof Error ? error.message : 'An error occurred', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserMessage(null);

    console.log('Adding admin user with email:', newUserEmail);

    if (newUserPassword.length < 6) {
      setAddUserMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setAddUserLoading(true);
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUserEmail, password: newUserPassword }),
      });

      console.log('API response status:', res.status);
      const data = await res.json();
      console.log('API response data:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add user');
      }

      setAddUserMessage({ text: 'Admin user added successfully!', type: 'success' });
      setNewUserEmail('');
      setNewUserPassword('');
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      setAddUserMessage({ text: error instanceof Error ? error.message : 'An error occurred', type: 'error' });
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin user?')) return;

    try {
      const res = await fetch(`/api/admin/register?id=${id}`, { method: 'DELETE' });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#0B1F3A] mb-8">Settings</h1>

      <div className="grid gap-8">
        {session?.user?.email === ORIGINAL_ADMIN_EMAIL && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#0B1F3A] mb-6">Admin Users</h2>
            
            {addUserMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                addUserMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {addUserMessage.text}
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-lg font-medium text-[#0B1F3A] mb-4">Add New Admin</h3>
              <form onSubmit={handleAddUser} className="flex gap-4 max-w-2xl">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">Email</label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showNewUserPassword ? 'text' : 'password'}
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-slate-500 hover:text-slate-700"
                    >
                      {showNewUserPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="self-end">
                  <button
                    type="submit"
                    disabled={addUserLoading}
                    className="bg-[#C9A84C] hover:bg-[#b89744] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addUserLoading ? 'Adding...' : 'Add Admin'}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#0B1F3A] mb-4">Existing Admins</h3>
              {usersLoading ? (
                <p className="text-slate-500">Loading users...</p>
              ) : (
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-[#0B1F3A]">{user.email}</p>
                        <p className="text-sm text-slate-500">Added: {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#0B1F3A] mb-6">Change Password</h2>
          
          {passwordMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              passwordMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-[#0B1F3A] mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-slate-500 hover:text-slate-700"
                >
                  {showCurrentPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B1F3A] mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-slate-500 hover:text-slate-700"
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B1F3A] mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-slate-500 hover:text-slate-700"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-[#C9A84C] hover:bg-[#b89744] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

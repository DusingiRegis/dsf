'use client';

import { useState, useEffect } from 'react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string | null;
  property?: { id: string; title: string } | null;
  isRead: boolean;
  createdAt: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/inquiries?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, isRead: true } : i));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-[#0B1F3A] mb-8">Inquiries</h1>
        <p className="text-slate-500">Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#0B1F3A] mb-8">Inquiries</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500">No inquiries yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {inquiries.map(inquiry => (
              <div key={inquiry.id} className={`p-6 ${!inquiry.isRead ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[#0B1F3A]">{inquiry.name}</h3>
                      {!inquiry.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                    </div>
                    <div className="flex items-center gap-4 mb-2 text-sm text-slate-500">
                      <p>📧 {inquiry.email}</p>
                      <p>📞 {inquiry.phone}</p>
                    </div>
                    {inquiry.property && (
                      <p className="text-sm text-[#C9A84C] mb-2">
                        🏠 Re: {inquiry.property.title}
                      </p>
                    )}
                    <p className="text-[#6B7280] mb-4">{inquiry.message}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(inquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!inquiry.isRead && (
                      <button
                        onClick={() => markAsRead(inquiry.id)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteInquiry(inquiry.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

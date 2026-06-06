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

export default function ClientInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [sentReplies, setSentReplies] = useState<Set<string>>(new Set());

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

  const openReply = (inquiry: Inquiry) => {
    setReplyingTo(inquiry.id);
    setReplyText('');
    if (!inquiry.isRead) markAsRead(inquiry.id);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const sendReply = async (inquiry: Inquiry) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      await fetch('/api/inquiries/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: inquiry.id,
          toEmail: inquiry.email,
          toName: inquiry.name,
          message: replyText.trim(),
        }),
      });
      setSentReplies(prev => new Set(prev).add(inquiry.id));
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-8">Inquiries</h1>
        <p className="text-slate-500">Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-8">Inquiries</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500">No inquiries yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {inquiries.map(inquiry => (
              <div key={inquiry.id} className={`p-4 md:p-6 ${!inquiry.isRead ? 'bg-blue-50' : ''}`}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Name + unread dot + replied badge */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-[#0B1F3A]">{inquiry.name}</h3>
                        {!inquiry.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>}
                        {sentReplies.has(inquiry.id) && (
                          <span className="text-xs bg-green-100 text-green-600 font-semibold px-2 py-0.5 rounded-full">
                            ✓ Replied
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-2 text-sm text-slate-500">
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

                    {/* Action buttons (mobile top) */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {replyingTo !== inquiry.id && (
                        <button
                          onClick={() => openReply(inquiry)}
                          className="text-[#C9A84C] hover:text-[#b8923d] text-sm font-medium"
                        >
                          ✉ Reply
                        </button>
                      )}
                      {!inquiry.isRead && replyingTo !== inquiry.id && (
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

                  {/* Inline reply box */}
                  {replyingTo === inquiry.id && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">
                        Replying to {inquiry.name} — {inquiry.email}
                      </p>
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-[#0B1F3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none"
                      />
                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <button
                          onClick={() => sendReply(inquiry)}
                          disabled={sendingReply || !replyText.trim()}
                          className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#C9A84C] text-white hover:bg-[#b8923d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                        >
                          {sendingReply ? 'Sending...' : '✉ Send Reply'}
                        </button>
                        <button
                          onClick={cancelReply}
                          className="px-4 py-2 text-sm text-slate-500 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors w-full sm:w-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';

type PropertySubmission = {
  id: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  propertyType: string;
  listingStatus: string;
  location: string;
  askingPrice: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  description: string;
  preferredContact: string;
  status: string;
  isReviewed: boolean;
  createdAt: string;
};

export default function ClientPropertySubmissions() {
  const [submissions, setSubmissions] = useState<PropertySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/property-submissions');
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsReviewed = async (id: string) => {
    try {
      const res = await fetch(`/api/property-submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isReviewed: true, status: 'reviewed' }),
      });

      if (res.ok) {
        setSubmissions(prev => prev.map(s => 
          s.id === id ? { ...s, isReviewed: true, status: 'reviewed' } : s
        ));
        setMessage({ text: 'Submission marked as reviewed!', type: 'success' });
      }
    } catch (error) {
      console.error('Error marking as reviewed:', error);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const res = await fetch(`/api/property-submissions/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSubmissions(prev => prev.filter(s => s.id !== id));
        setMessage({ text: 'Submission deleted successfully!', type: 'success' });
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      setMessage({ text: 'Failed to delete submission', type: 'error' });
    }
  };

  useEffect(() => {
    fetchSubmissions();
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
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-8">Property Submissions</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500">No property submissions yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {submissions.map((submission) => (
              <div key={submission.id} className="border-b border-slate-200">
                <div 
                  className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedRow(expandedRow === submission.id ? null : submission.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#0B1F3A]">
                        {submission.ownerName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        submission.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : submission.status === 'reviewed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {submission.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-1">
                        📧 {submission.email}
                      </span>
                      <span className="flex items-center gap-1">
                        📞 {submission.phoneNumber}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span>
                        <strong>Property:</strong> {submission.propertyType} ({submission.listingStatus})
                      </span>
                      <span>
                        <strong>Location:</strong> {submission.location}
                      </span>
                      <span>
                        <strong>Price:</strong> {submission.currency} {submission.askingPrice.toLocaleString()}
                      </span>
                      {submission.bedrooms && (
                        <span><strong>Bedrooms:</strong> {submission.bedrooms}</span>
                      )}
                      {submission.bathrooms && (
                        <span><strong>Bathrooms:</strong> {submission.bathrooms}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 md:mt-0">
                    {!submission.isReviewed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsReviewed(submission.id);
                        }}
                        className="px-3 py-1 bg-[#C9A84C] text-white rounded-md text-sm font-medium hover:bg-[#b8923d] transition-colors"
                      >
                        Mark as Reviewed
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSubmission(submission.id);
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                    <span className="text-sm text-slate-500">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {expandedRow === submission.id && (
                  <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200">
                    <h4 className="font-semibold text-[#0B1F3A] mb-3">Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-600">
                          <strong>Preferred Contact:</strong> {submission.preferredContact}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-2 font-medium">Description:</p>
                      <p className="text-[#6B7280] whitespace-pre-wrap">
                        {submission.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

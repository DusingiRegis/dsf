'use client';

import { useState, useEffect } from 'react';

export default function ClientActivity() {
  const [properties, setProperties] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [propsRes, inqRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/inquiries')
      ]);
      const propsData = await propsRes.json();
      const inqData = await inqRes.json();
      setProperties(propsData);
      setInquiries(inqData);
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-8">Activity</h1>
        <p className="text-slate-500">Loading activity...</p>
      </div>
    );
  }

  const activities = [
    ...properties.map(p => ({
      type: 'property',
      id: p.id,
      title: `New property listed: ${p.title}`,
      date: p.createdAt,
      details: `$${p.price.toLocaleString()} - ${p.location}`
    })),
    ...inquiries.map(i => ({
      type: 'inquiry',
      id: i.id,
      title: `New inquiry from ${i.name}`,
      date: i.createdAt,
      details: i.email
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-8">Activity</h1>
      
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-6 border-b border-slate-200 last:border-0 last:pb-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0 ${activity.type === 'property' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                {activity.type === 'property' ? '🏠' : '📩'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#0B1F3A]">{activity.title}</p>
                <p className="text-slate-500 text-sm mt-1">{activity.details}</p>
                <p className="text-slate-400 text-xs mt-2">
                  {new Date(activity.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-slate-500">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}
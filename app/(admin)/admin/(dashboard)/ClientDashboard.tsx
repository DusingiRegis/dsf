"use client"

import { useState, useEffect } from "react"

export default function ClientDashboard() {
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
      console.error('Error fetching dashboard data:', error);
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-8">Admin Dashboard</h1>
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const available = properties.filter(p => p.status === 'available');
  const pending = properties.filter(p => p.status === 'pending');
  const sold = properties.filter(p => p.status === 'sold');
  const unreadInquiries = inquiries.filter(i => !i.isRead);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          { name: 'Total Properties', value: properties.length, icon: '🏠', color: 'bg-blue-500' },
          { name: 'Available', value: available.length, icon: '💰', color: 'bg-green-500' },
          { name: 'In Talks', value: pending.length, icon: '💬', color: 'bg-yellow-500' },
          { name: 'Sold', value: sold.length, icon: '🏷️', color: 'bg-red-500' },
          { name: 'Inquiries', value: inquiries.length, icon: '📩', color: 'bg-purple-500', subValue: unreadInquiries.length > 0 ? `${unreadInquiries.length} unread` : '' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-500 text-xs">{stat.name}</p>
                <p className="text-2xl font-bold text-[#0B1F3A]">{stat.value}</p>
                {stat.subValue && <p className="text-xs text-purple-500">{stat.subValue}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#0B1F3A] mb-4">Recent Properties</h2>
        <div className="space-y-4">
          {properties.slice(0, 5).map((property) => (
            <div key={property.id} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
              <div>
                <p className="font-medium text-[#0B1F3A]">{property.title}</p>
                <p className="text-slate-500 text-sm">
                  {new Date(property.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#0B1F3A]">${property.price?.toLocaleString()}</p>
                <p className="text-slate-500 text-sm">
                  {property.status === 'available' ? 'Available' : property.status === 'pending' ? 'In Talks' : 'Sold'}
                </p>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <p className="text-slate-500">No properties yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

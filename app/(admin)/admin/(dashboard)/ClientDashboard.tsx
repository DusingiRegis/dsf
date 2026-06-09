'use client';

import { useState, useEffect } from 'react';

export default function ClientDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [propsRes, inqRes, analyticsRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/inquiries'),
        fetch('/api/analytics/visit'),
      ]);
      const propsData = await propsRes.json();
      const inqData = await inqRes.json();
      setProperties(propsData.properties || propsData || []);
      setInquiries(inqData.inquiries || inqData || []);
      
      try {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      } catch {
        // If analytics fails, just set to default
        setAnalytics({
          totalVisits: 0,
          todayVisits: 0,
          visitsByPage: [],
          dailyVisits: [],
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setProperties([]);
      setInquiries([]);
    } finally {
      setLoading(false);
      setAnalyticsLoading(false);
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

  // Prepare last 14 days for chart
  const last14Days = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last14Days.push(dateStr);
  }

  const chartData = last14Days.map(date => {
    const entry = analytics?.dailyVisits?.find((d: any) => d.date === date);
    return {
      date,
      count: entry?.count || 0,
      label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  // Calculate week visits
  const weekVisits = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        {[
          { name: 'Total Properties', value: properties.length, icon: '🏠', color: 'bg-blue-500' },
          { name: 'Available', value: available.length, icon: '💰', color: 'bg-green-500' },
          { name: 'In Talks', value: pending.length, icon: '💬', color: 'bg-yellow-500' },
          { name: 'Sold', value: sold.length, icon: '🏷️', color: 'bg-red-500' },
          { name: 'Inquiries', value: inquiries.length, icon: '📩', color: 'bg-purple-500', subValue: unreadInquiries.length > 0 ? `${unreadInquiries.length} unread` : '' },
          { name: 'Visitors Today', value: analytics?.todayVisits || 0, icon: '👥', color: 'bg-indigo-500', subValue: `Total: ${analytics?.totalVisits || 0}` },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-500 text-xs">{stat.name}</p>
                <p className="text-2xl font-bold text-[#0B1F3A]">{stat.value}</p>
                {stat.subValue && <p className="text-xs text-slate-500">{stat.subValue}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Visits Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#0B1F3A] mb-4">Visits Last 14 Days</h2>
          <div className="flex items-end justify-between gap-1 h-48">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-gradient-to-t from-indigo-400 to-indigo-600 w-full rounded-t-md transition-all hover:from-indigo-500 hover:to-indigo-700"
                  style={{ height: `${(d.count / maxCount) * 100}%` }}
                />
                <span className="text-xs text-slate-500 mt-2 transform -rotate-45 origin-bottom-left">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#0B1F3A] mb-4">Top Pages</h2>
          <div className="space-y-4">
            {(analytics?.visitsByPage || []).slice(0,5).map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[#6B7280] truncate max-w-[70%]">{item.page}</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">{item.count}</span>
              </div>
            ))}
            {(!analytics?.visitsByPage || analytics.visitsByPage.length === 0) && (
              <p className="text-slate-500 text-sm">No page data yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#0B1F3A] mb-4">Recent Properties</h2>
        <div className="space-y-4">
          {properties.slice(0, 5).map((property) => (
            <div key={property.id} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
              <div>
                <p className="font-semibold text-[#0B1F3A]">{property.title}</p>
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

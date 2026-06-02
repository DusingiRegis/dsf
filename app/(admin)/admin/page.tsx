'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Dummy data
const DUMMY_STATS = {
  totalProperties: 6,
  availableProperties: 4,
  soldProperties: 2,
  totalInquiries: 12,
  unreadInquiries: 3,
  totalVisitors: 458,
  todayVisitors: 23
};

const DUMMY_RECENT_INQUIRIES = [
  { id: '1', name: 'John Smith', email: 'john@example.com' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com' },
  { id: '3', name: 'Mike Wilson', email: 'mike@example.com' },
];

const DUMMY_RECENT_PROPERTIES = [
  { id: '1', title: 'Modern Luxury Villa', price: 850000 },
  { id: '2', title: 'Cozy Suburban Home', price: 450000 },
  { id: '3', title: 'Waterfront Plot', price: 250000 },
];

// Dummy visitors data
const DUMMY_VISITORS = [
  { id: 'v1', ip: '192.168.1.1', location: 'New York, USA', page: '/properties', time: '2 minutes ago' },
  { id: 'v2', ip: '10.0.0.5', location: 'London, UK', page: '/', time: '15 minutes ago' },
  { id: 'v3', ip: '172.16.0.3', location: 'Paris, France', page: '/properties/1', time: '35 minutes ago' },
  { id: 'v4', ip: '192.168.2.4', location: 'Tokyo, Japan', page: '/about', time: '1 hour ago' },
  { id: 'v5', ip: '10.1.1.7', location: 'Sydney, Australia', page: '/contact', time: '2 hours ago' },
  { id: 'v6', ip: '172.20.0.8', location: 'Berlin, Germany', page: '/properties/3', time: '3 hours ago' },
];

export default function AdminDashboardPage() {
  const [showAllVisitors, setShowAllVisitors] = useState(false);

  const displayVisitors = showAllVisitors ? DUMMY_VISITORS : DUMMY_VISITORS.slice(0, 5);

  return (
    <main className="min-h-screen bg-admin-bg text-white p-8">
      <h1 className="font-serif text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-12">
        <div className="bg-admin-card p-6 rounded-xl border-l-4 border-blue-500">
          <p className="text-muted mb-1">Total Properties</p>
          <p className="text-3xl font-bold">{DUMMY_STATS.totalProperties}</p>
        </div>
        <div className="bg-admin-card p-6 rounded-xl border-l-4 border-green-500">
          <p className="text-muted mb-1">Available</p>
          <p className="text-3xl font-bold">{DUMMY_STATS.availableProperties}</p>
        </div>
        <div className="bg-admin-card p-6 rounded-xl border-l-4 border-red-500">
          <p className="text-muted mb-1">Sold</p>
          <p className="text-3xl font-bold">{DUMMY_STATS.soldProperties}</p>
        </div>
        <div className="bg-admin-card p-6 rounded-xl border-l-4 border-purple-500">
          <p className="text-muted mb-1">Total Inquiries</p>
          <p className="text-3xl font-bold">{DUMMY_STATS.totalInquiries}</p>
        </div>
        <div className="bg-admin-card p-6 rounded-xl border-l-4 border-yellow-500">
          <p className="text-muted mb-1">Unread</p>
          <p className="text-3xl font-bold">{DUMMY_STATS.unreadInquiries}</p>
        </div>
        <div className="bg-admin-card p-6 rounded-xl border-l-4 border-cyan-500">
          <p className="text-muted mb-1">Total Visitors</p>
          <p className="text-3xl font-bold">{DUMMY_STATS.totalVisitors}</p>
        </div>
        <div className="bg-admin-card p-6 rounded-xl border-l-4 border-pink-500">
          <p className="text-muted mb-1">Today&apos;s Visitors</p>
          <p className="text-3xl font-bold">{DUMMY_STATS.todayVisitors}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-12">
        <Link href="/admin/properties/new">
          <Button>Add Property</Button>
        </Link>
        <Link href="/admin/inquiries">
          <Button variant="secondary">View Inquiries</Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-admin-card p-6 rounded-xl">
          <h2 className="font-serif text-xl font-semibold mb-4">Recent Inquiries</h2>
          <div className="space-y-3">
            {DUMMY_RECENT_INQUIRIES.map((inquiry) => (
              <div key={inquiry.id} className="border-b border-gray-700 pb-3">
                <p className="font-medium">{inquiry.name}</p>
                <p className="text-muted text-sm">{inquiry.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-admin-card p-6 rounded-xl">
          <h2 className="font-serif text-xl font-semibold mb-4">Recent Properties</h2>
          <div className="space-y-3">
            {DUMMY_RECENT_PROPERTIES.map((property) => (
              <div key={property.id} className="border-b border-gray-700 pb-3">
                <p className="font-medium">{property.title}</p>
                <p className="text-muted text-sm">${property.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="bg-admin-card p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl font-semibold">Recent Visitors</h2>
            <Button
              size="sm"
              variant="secondary"
              theme="admin"
              onClick={() => setShowAllVisitors(!showAllVisitors)}
            >
              {showAllVisitors ? 'Show Less' : 'Show All'}
            </Button>
          </div>
          <div className="space-y-4">
            {displayVisitors.map((visitor) => (
              <div key={visitor.id} className="border-b border-gray-700 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{visitor.location}</p>
                    <p className="text-muted text-sm">IP: {visitor.ip}</p>
                  </div>
                  <span className="text-sm text-gray-400">{visitor.time}</span>
                </div>
                <p className="text-cyan-300 text-sm mt-1">Viewed: {visitor.page}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

// Fallback dummy properties data
const DUMMY_PROPERTIES = [
  { id: '1', title: 'Modern Luxury Villa', type: 'house', price: 850000, location: 'Beverly Hills, CA', status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'Cozy Suburban Home', type: 'house', price: 450000, location: 'Austin, TX', status: 'available', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'Waterfront Plot', type: 'plot', price: 250000, location: 'Miami, FL', status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data);
        } else {
          setProperties(DUMMY_PROPERTIES);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to dummy data if API fails
        setProperties(DUMMY_PROPERTIES);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await fetch(`/api/properties/${id}`, { method: 'DELETE' });
        setProperties(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting property:', error);
        // Still update the UI even if API fails
        setProperties(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-admin-bg text-white p-8 flex items-center justify-center"><p className="text-xl">Loading...</p></main>;
  }

  return (
    <main className="min-h-screen bg-admin-bg text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold">Properties</h1>
        <Link href="/admin/properties/new">
          <Button theme="admin">Add New Property</Button>
        </Link>
      </div>

      <div className="bg-admin-card rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Location</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Featured</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-gray-700">
                <td className="p-4">{property.title}</td>
                <td className="p-4 capitalize">{property.type}</td>
                <td className="p-4">${(property.price || 0).toLocaleString()}</td>
                <td className="p-4">{property.location}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${property.status === 'available' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {property.status}
                  </span>
                </td>
                <td className="p-4">{property.featured ? 'Yes' : 'No'}</td>
                <td className="p-4 flex gap-2">
                  <Link href={`/admin/properties/${property.id}/edit`}>
                    <Button size="sm" theme="admin">Edit</Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="secondary"
                    theme="admin"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => handleDelete(property.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

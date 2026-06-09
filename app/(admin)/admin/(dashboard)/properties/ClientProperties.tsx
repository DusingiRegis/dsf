'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  type: string;
  listingType: string;
  status: string;
  price: number;
  createdAt: string;
}

export default function ClientProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      setProperties(data.properties || data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== id));
        alert('✅ Property deleted successfully!');
      } else {
        alert('❌ Failed to delete property. Please try again.');
      }
    } catch (error) {
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'available' | 'sold' | 'pending') => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        setProperties(prev => prev.map(p => 
          p.id === id ? { ...p, status: newStatus } : p
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A]">Properties</h1>
        <Link href="/admin/properties/new" className="bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all w-full md:w-auto text-center">
          Add Property
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Property</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Listing</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading properties...</td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No properties found. Add one!</td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 text-[#0B1F3A]">{property.title}</td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{property.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        property.listingType === 'rent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={property.status}
                        onChange={(e) => handleStatusChange(property.id, e.target.value as 'available' | 'sold' | 'pending')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer ${
                          property.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : property.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="available" className="bg-white text-gray-900">Available</option>
                        <option value="pending" className="bg-white text-gray-900">In Talks</option>
                        <option value="sold" className="bg-white text-gray-900">Sold Out</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0B1F3A]">
                      ${property.price.toLocaleString()}
                      {property.listingType === 'rent' && <span className="text-xs text-slate-500 ml-1">/mo</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(property.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="text-slate-500 hover:text-[#C9A84C] transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id, property.title)}
                        disabled={deletingId === property.id}
                        className="text-slate-500 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === property.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden">
          {loading ? (
            <div className="p-6 text-center text-slate-500">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No properties found. Add one!</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {properties.map((property) => (
                <div key={property.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-[#0B1F3A]">{property.title}</p>
                      <p className="text-slate-500 text-sm mt-1">
                        {new Date(property.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        property.listingType === 'rent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                      </span>
                      <select
                        value={property.status}
                        onChange={(e) => handleStatusChange(property.id, e.target.value as 'available' | 'sold' | 'pending')}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer ${
                          property.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : property.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="available" className="bg-white text-gray-900">Available</option>
                        <option value="pending" className="bg-white text-gray-900">In Talks</option>
                        <option value="sold" className="bg-white text-gray-900">Sold Out</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <span className="text-sm text-slate-600 capitalize bg-slate-100 px-3 py-1 rounded-full">{property.type}</span>
                  </div>
                  <p className="text-lg font-bold text-[#0B1F3A]">
                    ${property.price.toLocaleString()}
                    {property.listingType === 'rent' && <span className="text-sm text-slate-500 ml-1">/month</span>}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="text-slate-500 hover:text-[#C9A84C] transition-colors py-2 px-4 border border-slate-200 rounded-lg"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id, property.title)}
                      disabled={deletingId === property.id}
                      className="text-slate-500 hover:text-red-500 transition-colors py-2 px-4 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === property.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
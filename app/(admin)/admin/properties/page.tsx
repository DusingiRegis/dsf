'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  status: string;
  price: number;
  createdAt: string;
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#0B1F3A]">Properties</h1>
        <Link href="/admin/properties/new" className="bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-500 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          Add Property
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Property</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1F3A]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading properties...</td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No properties found. Add one!</td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 text-[#0B1F3A]">{property.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status === 'available' ? 'Available' : 'Sold'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#0B1F3A]">
                    ${property.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(property.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-slate-500 hover:text-[#C9A84C] transition-colors">Edit</button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="text-slate-500 hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

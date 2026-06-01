'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <main className="min-h-screen bg-admin-bg text-white p-8 flex items-center justify-center"><p className="text-xl">Loading...</p></main>;
  }

  if (!formData) {
    return (
      <main className="min-h-screen bg-admin-bg text-white p-8">
        <h1 className="font-serif text-2xl font-bold mb-4">Property not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </main>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) :
             type === 'checkbox' ? (e.target as HTMLInputElement).checked :
             value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      alert('Property saved successfully!');
      router.push('/admin/properties');
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  return (
    <main className="min-h-screen bg-admin-bg text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold">Edit Property</h1>
        <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>

      <div className="bg-admin-card p-8 rounded-xl max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Property Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
            >
              <option value="house">House</option>
              <option value="plot">Plot</option>
            </select>
          </div>

          {/* Price & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
              />
            </div>
          </div>

          {/* Size, Bedrooms, Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Size (sqft)</label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms || ''}
                onChange={handleChange}
                disabled={formData.type === 'plot'}
                className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms || ''}
                onChange={handleChange}
                disabled={formData.type === 'plot'}
                className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white disabled:opacity-50"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
            />
          </div>

          {/* Status & Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label htmlFor="featured" className="text-sm font-medium">Featured Property</label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" size="lg">Save Changes</Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </div>
    </main>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddPropertyPage() {
  const router = useRouter();
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'house',
    listingType: 'sale',
    price: 0,
    location: '',
    size: 0,
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    description: '',
    status: 'available',
    featured: false,
    images: '[]',
    videos: '[]',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'number' ? Number(value) :
        type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        value,
    }));
  };

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Upload failed');
    if (data.url) return data.url;
    throw new Error('Upload failed: No URL returned');
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingImages(true);
    try {
      const newUrls = await Promise.all(files.map(uploadFile));
      const updated = [...imageUrls, ...newUrls];
      setImageUrls(updated);
      setFormData(prev => ({ ...prev, images: JSON.stringify(updated) }));
    } catch (error) {
      alert(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadingImages(false);
    }
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    const updated = [...imageUrls, newImageUrl.trim()];
    setImageUrls(updated);
    setFormData(prev => ({ ...prev, images: JSON.stringify(updated) }));
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updated);
    setFormData(prev => ({ ...prev, images: JSON.stringify(updated) }));
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingVideos(true);
    try {
      const newUrls = await Promise.all(files.map(uploadFile));
      const updated = [...videoUrls, ...newUrls];
      setVideoUrls(updated);
      setFormData(prev => ({ ...prev, videos: JSON.stringify(updated) }));
    } catch (error) {
      alert(`Failed to upload videos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadingVideos(false);
    }
  };

  const addVideo = () => {
    if (!newVideoUrl.trim()) return;
    const updated = [...videoUrls, newVideoUrl.trim()];
    setVideoUrls(updated);
    setFormData(prev => ({ ...prev, videos: JSON.stringify(updated) }));
    setNewVideoUrl('');
  };

  const removeVideo = (index: number) => {
    const updated = videoUrls.filter((_, i) => i !== index);
    setVideoUrls(updated);
    setFormData(prev => ({ ...prev, videos: JSON.stringify(updated) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      alert('Property added successfully!');
      router.push('/admin/properties');
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const inputClass = "w-full border border-slate-300 rounded-lg px-4 py-2 text-[#0B1F3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-sm";
  const disabledInputClass = "w-full border border-slate-300 rounded-lg px-4 py-2 text-[#0B1F3A] bg-slate-100 text-sm opacity-50 cursor-not-allowed";

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A]">Add New Property</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-500 border border-slate-300 rounded-lg px-4 py-2 hover:bg-slate-100 transition-colors w-full md:w-auto"
        >
          Cancel
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-3xl">
        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass} required />
          </div>

          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Listing Type</label>
            <select name="listingType" value={formData.listingType} onChange={handleChange} className={inputClass}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Property Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Price & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} min={0} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} required />
            </div>
          </div>

          {/* Size, Bedrooms, Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Size (sqft)</label>
              <input type="number" name="size" value={formData.size} onChange={handleChange} className={inputClass} min={0} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms || ''}
                onChange={handleChange}
                disabled={formData.type === 'plot'}
                className={formData.type === 'plot' ? disabledInputClass : inputClass}
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms || ''}
                onChange={handleChange}
                disabled={formData.type === 'plot'}
                className={formData.type === 'plot' ? disabledInputClass : inputClass}
                min={0}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={inputClass}
              required
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-[#0B1F3A] mb-2">Images</label>
            <div className="space-y-3">
              {/* File upload */}
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-4 bg-slate-50 hover:border-[#C9A84C] cursor-pointer transition-colors">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageFileUpload} disabled={uploadingImages} />
                <span className="text-sm text-slate-500">
                  {uploadingImages ? 'Uploading images...' : '📷 Upload images from your computer'}
                </span>
              </label>

              {/* URL input */}
              <div>
                <p className="text-xs text-slate-400 mb-1">Or add via URL:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className={inputClass + ' flex-1'}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 text-sm font-semibold bg-[#C9A84C] text-white rounded-lg hover:bg-[#b8923d] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Image preview */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt={`Property ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videos */}
          <div>
            <label className="block text-sm font-medium text-[#0B1F3A] mb-2">Videos</label>
            <div className="space-y-3">
              {/* File upload */}
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-4 bg-slate-50 hover:border-[#C9A84C] cursor-pointer transition-colors">
                <input type="file" accept="video/*" multiple className="hidden" onChange={handleVideoFileUpload} disabled={uploadingVideos} />
                <span className="text-sm text-slate-500">
                  {uploadingVideos ? 'Uploading videos...' : '🎬 Upload videos from your computer'}
                </span>
              </label>

              {/* URL input */}
              <div>
                <p className="text-xs text-slate-400 mb-1">Or add via URL:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVideoUrl}
                    onChange={e => setNewVideoUrl(e.target.value)}
                    placeholder="Enter video URL (e.g., YouTube, Vimeo, etc.)"
                    className={inputClass + ' flex-1'}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addVideo())}
                  />
                  <button
                    type="button"
                    onClick={addVideo}
                    className="px-4 py-2 text-sm font-semibold bg-[#C9A84C] text-white rounded-lg hover:bg-[#b8923d] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Video list */}
            {videoUrls.length > 0 && (
              <div className="space-y-2 mt-4">
                {videoUrls.map((url, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                    <span className="text-sm text-slate-600 truncate flex-1">{url}</span>
                    <button
                      type="button"
                      onClick={() => removeVideo(idx)}
                      className="text-sm text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status & Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                <option value="available">Available</option>
                <option value="pending">In Talks</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pb-1">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-[#C9A84C] cursor-pointer"
              />
              <label htmlFor="featured" className="text-sm font-medium text-[#0B1F3A] cursor-pointer">
                Featured Property
              </label>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold bg-[#C9A84C] text-white rounded-lg hover:bg-[#b8923d] transition-colors"
            >
              Add Property
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 text-sm text-slate-500 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
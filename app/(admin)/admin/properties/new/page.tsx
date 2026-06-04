'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddPropertyPage() {
  const router = useRouter();
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    type: 'house',
    price: 0,
    location: '',
    size: 0,
    bedrooms: null,
    bathrooms: null,
    description: '',
    status: 'available',
    featured: false,
    images: '[]',
    videos: '[]'
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) :
             type === 'checkbox' ? (e.target as HTMLInputElement).checked :
             value
    }));
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    if (data.url) return data.url;
    throw new Error('Upload failed: No URL returned');
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setUploadingImages(true);
    try {
      const uploadPromises = files.map(file => uploadFile(file));
      const newUrls = await Promise.all(uploadPromises);
      
      const updatedImages = [...imageUrls, ...newUrls];
      setImageUrls(updatedImages);
      setFormData(prev => ({ ...prev, images: JSON.stringify(updatedImages) }));
    } catch (error) {
      console.error('Image upload error:', error);
      alert(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadingImages(false);
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      const updatedImages = [...imageUrls, newImageUrl.trim()];
      setImageUrls(updatedImages);
      setFormData(prev => ({ ...prev, images: JSON.stringify(updatedImages) }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    setFormData(prev => ({ ...prev, images: JSON.stringify(updatedImages) }));
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setUploadingVideos(true);
    try {
      const uploadPromises = files.map(file => uploadFile(file));
      const newUrls = await Promise.all(uploadPromises);
      
      const updatedVideos = [...videoUrls, ...newUrls];
      setVideoUrls(updatedVideos);
      setFormData(prev => ({ ...prev, videos: JSON.stringify(updatedVideos) }));
    } catch (error) {
      console.error('Video upload error:', error);
      alert(`Failed to upload videos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadingVideos(false);
    }
  };

  const addVideo = () => {
    if (newVideoUrl.trim()) {
      const updatedVideos = [...videoUrls, newVideoUrl.trim()];
      setVideoUrls(updatedVideos);
      setFormData(prev => ({ ...prev, videos: JSON.stringify(updatedVideos) }));
      setNewVideoUrl('');
    }
  };

  const removeVideo = (index: number) => {
    const updatedVideos = videoUrls.filter((_, i) => i !== index);
    setVideoUrls(updatedVideos);
    setFormData(prev => ({ ...prev, videos: JSON.stringify(updatedVideos) }));
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

  return (
    <main className="min-h-screen bg-admin-bg text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold">Add New Property</h1>
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
              required
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
                min={0}
                required
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
                required
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
                min={0}
                required
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
                min={0}
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
                min={0}
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
              required
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <div className="space-y-4">
              {/* File upload */}
              <div>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-600 rounded-lg px-4 py-4 bg-gray-900 hover:border-[#C9A84C] cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageFileUpload}
                    disabled={uploadingImages}
                  />
                  <span className="text-gray-400">
                    {uploadingImages ? 'Uploading images...' : '📷 Upload images from your computer'}
                  </span>
                </label>
              </div>

              {/* URL input */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Or add via URL:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  />
                  <Button type="button" theme="admin" onClick={addImage}>Add</Button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative">
                  <img src={url} alt={`Property ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div>
            <label className="block text-sm font-medium mb-1">Videos</label>
            <div className="space-y-4">
              {/* File upload */}
              <div>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-600 rounded-lg px-4 py-4 bg-gray-900 hover:border-[#C9A84C] cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={handleVideoFileUpload}
                    disabled={uploadingVideos}
                  />
                  <span className="text-gray-400">
                    {uploadingVideos ? 'Uploading videos...' : '🎬 Upload videos from your computer'}
                  </span>
                </label>
              </div>

              {/* URL input */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Or add via URL:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="Enter video URL (e.g., YouTube, Vimeo, etc.)"
                    className="flex-1 border border-gray-700 rounded-lg px-4 py-2 bg-gray-900 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVideo())}
                  />
                  <Button type="button" onClick={addVideo}>Add</Button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4 mt-4">
              {videoUrls.map((url, idx) => (
                <div key={idx} className="relative bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300 truncate flex-1 mr-4">{url}</span>
                    <button
                      type="button"
                      onClick={() => removeVideo(idx)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
            <Button type="submit" size="lg">Add Property</Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>Cancel</Button>
          </div>
        </form>
      </div>
    </main>
  );
}

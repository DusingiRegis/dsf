'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Define categories with their configurations
const CATEGORIES = {
  rental: {
    title: 'For Rent',
    subcategories: [
      { id: 'apartment-furnished', name: 'Furnished Apartment', icon: '🏢', type: 'apartment', listingType: 'rent', furnished: true },
      { id: 'apartment', name: 'Apartment', icon: '🏠', type: 'apartment', listingType: 'rent', furnished: false },
      { id: 'house-rent', name: 'House for Rent', icon: '🏡', type: 'house', listingType: 'rent' },
      { id: 'commercial-rent', name: 'Commercial Space', icon: '🏪', type: 'commercial', listingType: 'rent' },
    ]
  },
  sale: {
    title: 'For Sale',
    subcategories: [
      { id: 'apartment-sale', name: 'Apartment', icon: '🏢', type: 'apartment', listingType: 'sale' },
      { id: 'house-sale', name: 'House', icon: '🏡', type: 'house', listingType: 'sale' },
      { id: 'plot', name: 'Land/Plot', icon: '🌳', type: 'plot', listingType: 'sale' },
      { id: 'commercial-sale', name: 'Commercial', icon: '🏪', type: 'commercial', listingType: 'sale' },
    ]
  },
  cars: {
    title: 'Vehicles',
    subcategories: [
      { id: 'car', name: 'Car', icon: '🚗', type: 'car', listingType: 'sale' },
    ]
  }
};

// Feature options by category type
const FEATURE_OPTIONS = {
  house: ['Swimming Pool', 'Garden', 'Garage', 'Security', 'Air Conditioning', 'Gym', 'Balcony'],
  apartment: ['Swimming Pool', 'Elevator', 'Security', 'Air Conditioning', 'Gym', 'Balcony', 'Parking'],
  plot: ['Fenced', 'Water Supply', 'Electricity', 'Road Access', 'Zoned'],
  commercial: ['Parking', 'Security', 'Elevator', 'Warehouse', 'Office Space'],
  car: ['Leather Seats', 'Sunroof', 'GPS', 'Bluetooth', 'Backup Camera', 'Alloy Wheels'],
};

export default function AddPropertyPage() {
  const router = useRouter();
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'house',
    listingType: 'sale',
    price: 0,
    currency: 'USD',
    location: '',
    neighborhood: '',
    contactPhone: '',
    size: 0,
    bedrooms: null as number | null,
    bathrooms: null as number | null,
    description: '',
    status: 'available',
    featured: false,
    acceptInquiries: true,
    images: '[]',
    videos: '[]',
    
    // Rental specific
    furnished: false,
    pricePeriod: 'monthly',
    
    // Sales specific
    titleDeed: '',
    titleDeedType: '',
    
    // Plot specific
    plotSize: 0,
    zoning: '',
    roadAccess: '',
    
    // Car specific
    make: '',
    model: '',
    year: null as number | null,
    mileage: null as number | null,
    fuelType: '',
    transmission: '',
    color: '',
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setFormData(prev => ({
      ...prev,
      type: category.type,
      listingType: category.listingType,
      furnished: category.furnished || false,
    }));
    setSelectedFeatures([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let processedValue = value;
    
    // Allow only numbers for phone fields
    if (name === 'contactPhone') {
      processedValue = value.replace(/[^0-9]/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'number' ? (processedValue ? Number(processedValue) : null) :
        type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        processedValue,
    }));
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
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
      const submitData = {
        ...formData,
        features: JSON.stringify(selectedFeatures),
      };
      await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      alert('Property added successfully!');
      router.push('/admin/properties');
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const inputClass = "w-full border border-slate-300 rounded-lg px-4 py-2 text-[#0B1F3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-sm";
  const categoryTileClass = (selected: boolean) => 
    `p-4 border-2 rounded-xl cursor-pointer transition-all ${
      selected 
        ? 'border-[#C9A84C] bg-[#C9A84C]/10' 
        : 'border-slate-200 hover:border-[#C9A84C]/50'
    }`;

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
      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl">
        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-8">

          {/* Category Selection */}
          {!selectedCategory ? (
            <div className="space-y-8">
              {Object.entries(CATEGORIES).map(([sectionKey, section]) => (
                <div key={sectionKey}>
                  <h2 className="text-lg font-semibold text-[#0B1F3A] mb-4">{section.title}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {section.subcategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className={categoryTileClass(false)}
                      >
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <div className="text-sm font-medium text-[#0B1F3A]">{category.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Category Display */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedCategory.icon}</span>
                  <div>
                    <div className="font-semibold text-[#0B1F3A]">{selectedCategory.name}</div>
                    <div className="text-xs text-slate-500">{selectedCategory.listingType === 'rent' ? 'For Rent' : 'For Sale'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Change Category
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass} required />
              </div>

              {/* Price, Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Price</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} min={0} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Currency</label>
                  <select name="currency" value={formData.currency} onChange={handleChange} className={inputClass}>
                    <option value="USD">USD ($)</option>
                    <option value="FRW">FRW (RWF)</option>
                  </select>
                </div>
              </div>

              {/* Price Period - Only for Rentals */}
              {selectedCategory.listingType === 'rent' && (
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Price Period</label>
                  <select name="pricePeriod" value={formData.pricePeriod} onChange={handleChange} className={inputClass}>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              )}

              {/* Location & Neighborhood */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Neighborhood</label>
                  <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Contact Phone</label>
                <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className={inputClass} />
              </div>

              {/* Property Specific Fields */}
              {selectedCategory.type === 'car' ? (
                <div className="space-y-6 border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-[#0B1F3A]">Vehicle Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Make</label>
                      <input type="text" name="make" value={formData.make} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Model</label>
                      <input type="text" name="model" value={formData.model} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Year</label>
                      <input type="number" name="year" value={formData.year || ''} onChange={handleChange} className={inputClass} min={1990} max={2030} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Mileage</label>
                      <input type="number" name="mileage" value={formData.mileage || ''} onChange={handleChange} className={inputClass} min={0} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Fuel Type</label>
                      <select name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputClass}>
                        <option value="">Select...</option>
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="electric">Electric</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Transmission</label>
                      <select name="transmission" value={formData.transmission} onChange={handleChange} className={inputClass}>
                        <option value="">Select...</option>
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Color</label>
                    <input type="text" name="color" value={formData.color} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              ) : selectedCategory.type === 'plot' ? (
                <div className="space-y-6 border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-[#0B1F3A]">Plot Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Plot Size</label>
                      <input type="number" name="plotSize" value={formData.plotSize} onChange={handleChange} className={inputClass} min={0} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Zoning</label>
                      <input type="text" name="zoning" value={formData.zoning} onChange={handleChange} className={inputClass} placeholder="e.g., Residential, Commercial" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Road Access</label>
                      <input type="text" name="roadAccess" value={formData.roadAccess} onChange={handleChange} className={inputClass} placeholder="e.g., Paved, Gravel" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-[#0B1F3A]">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Size (sqft)</label>
                      <input type="number" name="size" value={formData.size} onChange={handleChange} className={inputClass} min={0} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Bedrooms</label>
                      <input type="number" name="bedrooms" value={formData.bedrooms || ''} onChange={handleChange} className={inputClass} min={0} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Bathrooms</label>
                      <input type="number" name="bathrooms" value={formData.bathrooms || ''} onChange={handleChange} className={inputClass} min={0} />
                    </div>
                  </div>
                  {selectedCategory.listingType === 'rent' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="furnished"
                        name="furnished"
                        checked={formData.furnished}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#C9A84C] cursor-pointer"
                      />
                      <label htmlFor="furnished" className="text-sm font-medium text-[#0B1F3A] cursor-pointer">
                        Furnished
                      </label>
                    </div>
                  )}
                  {selectedCategory.listingType === 'sale' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Title Deed Number</label>
                        <input type="text" name="titleDeed" value={formData.titleDeed} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#0B1F3A] mb-1">Title Deed Type</label>
                        <input type="text" name="titleDeedType" value={formData.titleDeedType} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Features */}
              {FEATURE_OPTIONS[selectedCategory.type as keyof typeof FEATURE_OPTIONS] && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">Features & Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {FEATURE_OPTIONS[selectedCategory.type as keyof typeof FEATURE_OPTIONS].map(feature => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                          selectedFeatures.includes(feature)
                            ? 'bg-[#C9A84C] text-white border-[#C9A84C]'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-[#C9A84C]'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="border-t border-slate-200 pt-6">
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
              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-[#0B1F3A] mb-2">Images</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-4 bg-slate-50 hover:border-[#C9A84C] cursor-pointer transition-colors">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageFileUpload} disabled={uploadingImages} />
                    <span className="text-sm text-slate-500">
                      {uploadingImages ? 'Uploading images...' : '📷 Upload images from your computer'}
                    </span>
                  </label>
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

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} alt={`Property ${idx + 1}`} className="w-full h-24 object-cover rounded-xl border border-slate-200" onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                              <rect width="200" height="200" fill="#f3f4f6"/>
                              <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="14" fill="#6b7280">Photo</text>
                            </svg>
                          `);
                        }} />
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
              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-[#0B1F3A] mb-2">Videos</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-4 bg-slate-50 hover:border-[#C9A84C] cursor-pointer transition-colors">
                    <input type="file" accept="video/*" multiple className="hidden" onChange={handleVideoFileUpload} disabled={uploadingVideos} />
                    <span className="text-sm text-slate-500">
                      {uploadingVideos ? 'Uploading videos...' : '🎬 Upload videos from your computer'}
                    </span>
                  </label>
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

              {/* Status & Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end border-t border-slate-200 pt-6">
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
                <div className="flex items-center gap-3 pb-1">
                  <input
                    type="checkbox"
                    id="acceptInquiries"
                    name="acceptInquiries"
                    checked={formData.acceptInquiries}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#C9A84C] cursor-pointer"
                  />
                  <label htmlFor="acceptInquiries" className="text-sm font-medium text-[#0B1F3A] cursor-pointer">
                    Accept Inquiries
                  </label>
                </div>
              </div>

              {/* Submit buttons */}
              <div className="flex gap-3 pt-2 border-t border-slate-200 pt-6">
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
            </div>
          )}

        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface Filters {
  status: 'all' | 'rent' | 'sale' | 'available' | 'sold' | 'pending';
  type: 'all' | 'house' | 'apartment' | 'plot' | 'commercial' | 'furnished' | 'unfurnished' | 'car';
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  features: string[];
  sort: 'newest' | 'price-low' | 'price-high';
  [key: string]: any;
}

interface SidebarProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  useFor?: 'properties' | 'cars';
}

export default function Sidebar({ filters, onFilterChange, useFor = 'properties' }: SidebarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  // Update temp filters when incoming filters change (like from navbar links)
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleStatusChange = (value: string) => {
    let status: 'all' | 'available' | 'pending' | 'sold' | 'rent' | 'sale' = 'all';
    if (value === 'Available') status = 'available';
    if (value === 'In Talks') status = 'pending';
    if (value === 'Sold Out') status = 'sold';
    if (value === 'For Rent') status = 'rent';
    if (value === 'For Sale') status = 'sale';
    setTempFilters({ ...tempFilters, status });
  };

  const handleTypeChange = (value: string) => {
    let type: 'all' | 'house' | 'apartment' | 'plot' | 'commercial' | 'furnished' | 'unfurnished' | 'car' = 'all';
    if (value === 'House') type = 'house';
    if (value === 'Apartment') type = 'apartment';
    if (value === 'Plot') type = 'plot';
    if (value === 'Commercial') type = 'commercial';
    if (value === 'Furnished') type = 'furnished';
    if (value === 'Unfurnished') type = 'unfurnished';
    if (value === 'Car') type = 'car';
    setTempFilters({ ...tempFilters, type });
  };

  const handleLocationChange = (value: string) => {
    setTempFilters({ ...tempFilters, location: value });
  };

  const handleMinPriceChange = (value: string) => {
    setTempFilters({ ...tempFilters, minPrice: value ? Number(value) : null });
  };

  const handleMaxPriceChange = (value: string) => {
    setTempFilters({ ...tempFilters, maxPrice: value ? Number(value) : null });
  };

  const handleBedroomsChange = (value: number | null) => {
    setTempFilters({ ...tempFilters, bedrooms: value });
  };

  const handleBathroomsChange = (value: number | null) => {
    setTempFilters({ ...tempFilters, bathrooms: value });
  };

  const handleFeatureToggle = (feature: string) => {
    const features = tempFilters.features.includes(feature)
      ? tempFilters.features.filter(f => f !== feature)
      : [...tempFilters.features, feature];
    setTempFilters({ ...tempFilters, features });
  };

  const handleApply = () => {
    onFilterChange(tempFilters);
  };

  const getStatusValue = () => {
    if (useFor === 'properties') {
      if (tempFilters.status === 'available') return 'Available';
      if (tempFilters.status === 'pending') return 'In Talks';
      if (tempFilters.status === 'sold') return 'Sold Out';
      return 'All';
    }
    if (tempFilters.status === 'rent') return 'For Rent';
    if (tempFilters.status === 'sale') return 'For Sale';
    return 'All';
  };

  const getTypeValue = () => {
    if (tempFilters.type === 'house') return 'House';
    if (tempFilters.type === 'apartment') return 'Apartment';
    if (tempFilters.type === 'plot') return 'Plot';
    if (tempFilters.type === 'commercial') return 'Commercial';
    if (tempFilters.type === 'furnished') return 'Furnished';
    if (tempFilters.type === 'unfurnished') return 'Unfurnished';
    if (tempFilters.type === 'car') return 'Car';
    return 'All Types';
  };

  return (
    <>
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="lg:hidden w-full bg-[#C9A84C] text-white px-6 py-3 rounded-lg font-semibold mb-4"
      >
        {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      
      <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">Filters</h3>
          
          <div className="mb-6">
            <label className="block text-[#6B7280] mb-2 font-medium">Status</label>
            <select 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
              value={getStatusValue()}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option>All</option>
              {useFor === 'properties' ? (
                <>
                  <option>Available</option>
                  <option>In Talks</option>
                  <option>Sold Out</option>
                </>
              ) : (
                <>
                  <option>For Rent</option>
                  <option>For Sale</option>
                </>
              )}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-[#6B7280] mb-2 font-medium">Type</label>
            <select 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
              value={getTypeValue()}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option>All Types</option>
              <option>Furnished</option>
              <option>Unfurnished</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Plot</option>
              <option>Commercial</option>
              <option>Car</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-[#6B7280] mb-2 font-medium">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={tempFilters.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#6B7280] mb-2 font-medium">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={tempFilters.minPrice || ''}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={tempFilters.maxPrice || ''}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[#6B7280] mb-2 font-medium">Bedrooms</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleBedroomsChange(tempFilters.bedrooms === num ? null : num)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    tempFilters.bedrooms === num
                      ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                      : 'border-gray-300 text-[#0B1F3A] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button 
                onClick={() => handleBedroomsChange(tempFilters.bedrooms === 6 ? null : 6)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  tempFilters.bedrooms === 6
                    ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                    : 'border-gray-300 text-[#0B1F3A] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                }`}
              >
                5+
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[#6B7280] mb-2 font-medium">Bathrooms</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => handleBathroomsChange(tempFilters.bathrooms === num ? null : num)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    tempFilters.bathrooms === num
                      ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                      : 'border-gray-300 text-[#0B1F3A] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button 
                onClick={() => handleBathroomsChange(tempFilters.bathrooms === 5 ? null : 5)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  tempFilters.bathrooms === 5
                    ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                    : 'border-gray-300 text-[#0B1F3A] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                }`}
              >
                4+
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[#6B7280] mb-2 font-medium">Features</label>
            <div className="space-y-2">
              {['Garden', 'Swimming Pool', 'Security', 'WiFi', 'Parking', 'AC'].map((feature, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer text-[#6B7280]">
                  <input 
                    type="checkbox" 
                    checked={tempFilters.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]" 
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={handleApply}
            className="w-full bg-[#C9A84C] hover:bg-[#B8973D] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

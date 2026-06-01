'use client';

import { useState } from 'react';
import Link from 'next/link';

// Dummy properties data
const DUMMY_PROPERTIES = [
  {
    id: '1',
    title: 'Modern Luxury Villa',
    type: 'house',
    price: 850000,
    location: 'Beverly Hills, CA',
    size: 3500,
    bedrooms: 4,
    bathrooms: 3,
    images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20modern%20villa%20exterior&image_size=square_hd'],
  },
  {
    id: '2',
    title: 'Cozy Suburban Home',
    type: 'house',
    price: 450000,
    location: 'Austin, TX',
    size: 2200,
    bedrooms: 3,
    bathrooms: 2,
    images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cozy%20suburban%20family%20home&image_size=square_hd'],
  },
  {
    id: '3',
    title: 'Waterfront Plot',
    type: 'plot',
    price: 250000,
    location: 'Miami, FL',
    size: 5000,
    bedrooms: null,
    bathrooms: null,
    images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=waterfront%20land%20plot&image_size=square_hd'],
  },
  {
    id: '4',
    title: 'Downtown Penthouse',
    type: 'house',
    price: 1200000,
    location: 'New York, NY',
    size: 2800,
    bedrooms: 3,
    bathrooms: 3,
    images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20downtown%20penthouse&image_size=square_hd'],
  },
  {
    id: '5',
    title: 'Mountain View Plot',
    type: 'plot',
    price: 180000,
    location: 'Denver, CO',
    size: 8000,
    bedrooms: null,
    bathrooms: null,
    images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20view%20land%20plot&image_size=square_hd'],
  },
  {
    id: '6',
    title: 'Beachfront House',
    type: 'house',
    price: 950000,
    location: 'San Diego, CA',
    size: 3200,
    bedrooms: 4,
    bathrooms: 3,
    images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=beachfront%20modern%20house&image_size=square_hd'],
  },
];

export default function PropertiesPage() {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  let filteredProperties = [...DUMMY_PROPERTIES];

  // Apply filters
  if (filterType !== 'all') {
    filteredProperties = filteredProperties.filter(p => p.type === filterType);
  }

  // Apply sorting
  if (sortBy === 'price-low') {
    filteredProperties.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProperties.sort((a, b) => b.price - a.price);
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-8 text-center">Properties for Sale</h1>

      {/* Filters & Sorting */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">Property Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">All Types</option>
              <option value="house">Houses</option>
              <option value="plot">Plots</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProperties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div
                className="h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${property.images[0]})` }}
              ></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl font-semibold">{property.title}</h3>
                  <span className="bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {property.type}
                  </span>
                </div>
                <p className="text-primary text-2xl font-bold mb-2">
                  ${property.price.toLocaleString()}
                </p>
                <p className="text-muted flex items-center gap-2 mb-3">
                  <span>📍</span> {property.location}
                </p>
                <p className="text-sm text-muted">
                  {property.size.toLocaleString()} sqft
                  {property.bedrooms && ` • ${property.bedrooms} beds`}
                  {property.bathrooms && ` • ${property.bathrooms} baths`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted mb-4">No properties found</p>
          <button
            onClick={() => {
              setFilterType('all');
              setSortBy('newest');
            }}
            className="text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}

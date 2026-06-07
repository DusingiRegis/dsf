"use client"

import { useState } from 'react';
import Link from 'next/link';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    type: string;
    status: string;
    listingType?: string;
    category: string;
    price: number;
    currency?: string;
    location: string;
    bedrooms?: number;
    bathrooms?: number;
    size?: number;
    image: string;
    agent?: string;
    featured?: boolean;
    addedDate?: string;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);

  const getStatusStyle = (status: string) => {
    if (status === 'available') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (status: string) => {
    if (status === 'available') return 'Available';
    if (status === 'pending') return 'In Talks';
    return 'Sold Out';
  };
  
  return (
    <Link
      href={`/properties/${property.id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col md:flex-row"
    >
      <div className="w-full md:w-80 h-56 md:h-auto flex-shrink-0 overflow-hidden bg-[#0B1F3A] flex items-center justify-center">
        {!imageError && property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-[#C9A84C] text-4xl">🏠</div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex gap-2 mb-3">
          <span className="badge-category">{property.category}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(property.status)}`}>
            {getStatusText(property.status)}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-[#0B1F3A] mb-2">{property.title}</h3>
        <p className="text-[#6B7280] flex items-center gap-2 mb-2">
          📍 {property.location}
        </p>
        {property.addedDate && (
          <p className="text-[#6B7280] text-sm flex items-center gap-2 mb-2">
            🗓️ {property.addedDate}
          </p>
        )}
        <div className="flex gap-4 text-[#6B7280] mb-4">
          {property.bedrooms && <span>🛏️ {property.bedrooms} Beds</span>}
          {property.bathrooms && <span>🚿 {property.bathrooms} Baths</span>}
          {property.size && <span>📐 {property.size} sqm</span>}
        </div>
        <div className="mt-auto flex justify-between items-center">
          {property.agent && (
            <span className="text-[#6B7280] flex items-center gap-2">
              👤 {property.agent}
            </span>
          )}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-[#0B1F3A]">
              {property.currency === 'FRW' 
                ? `${property.price.toLocaleString()} FRW` 
                : `$${property.price.toLocaleString()}`
              }
              {property.listingType === 'rent' && <span className="text-lg font-normal">/month</span>}
            </span>
            <button className="bg-[#C9A84C] hover:bg-[#B8973D] text-white px-4 py-2 rounded-lg transition-colors">
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

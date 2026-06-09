'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import PropertyCard from '@/components/public/PropertyCard';
import Image from 'next/image';

interface Property {
  id: string;
  title: string;
  type: 'house' | 'apartment' | 'plot' | 'commercial' | 'car';
  status: 'available' | 'pending' | 'sold';
  listingType: 'rent' | 'sale';
  category: string;
  price: number;
  currency?: string;
  location: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size?: number | null;
  images: string[];
  description: string;
  features?: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  addedDate: string;
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const parseImages = (imagesStr: any): string[] => {
    try {
      // If it's already an array, use it directly
      if (Array.isArray(imagesStr)) {
        return imagesStr.filter((img: any) => typeof img === 'string' && img.trim() !== '');
      }

      // If it's a string, try to parse it
      if (typeof imagesStr === 'string') {
        // If the string is empty, return empty array
        if (imagesStr.trim() === '') {
          return [];
        }
        // Try parsing as JSON
        try {
          const parsed = JSON.parse(imagesStr);
          if (Array.isArray(parsed)) {
            return parsed.filter((img: any) => typeof img === 'string' && img.trim() !== '');
          } else if (typeof parsed === 'string') {
            // If parsed result is a single string, treat as single image
            return [parsed];
          }
        } catch (e) {
          // If JSON parsing fails, maybe it's a single image URL
          return [imagesStr];
        }
      }
    } catch (e) {
      console.error('Error parsing images:', e);
    }
    return [];
  };

  const getPropertyEmoji = (type: string) => {
    switch (type) {
      case 'house': return '🏠';
      case 'apartment': return '🏢';
      case 'plot': return '🌳';
      case 'commercial': return '🏪';
      case 'car': return '🚗';
      default: return '🏠';
    }
  };

  const navigateImage = (direction: number) => {
    if (!property) return;
    setSelectedImage(prev => {
      let next = prev + direction;
      if (next < 0) next = property.images.length - 1;
      if (next >= property.images.length) next = 0;
      return next;
    });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isLightboxOpen) return;
    if (e.key === 'Escape') setIsLightboxOpen(false);
    if (e.key === 'ArrowLeft') navigateImage(-1);
    if (e.key === 'ArrowRight') navigateImage(1);
  }, [isLightboxOpen, property]);

  useEffect(() => {
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, handleKeyDown]);

  // Fetch property details
  const fetchProperty = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/properties/${id}`);

      console.log('API response status:', response.status);
      const data = await response.json();
      console.log('API data:', data);
      console.log('API data.images:', data.images);

      if (!response.ok) {
        setLoading(false);
        return;
      }

      // Parse images
      let images: string[] = parseImages(data.images);
      console.log('Parsed images:', images);

      // Parse features
      let features: string[] = [];
      try {
        if (typeof data.features === 'string') {
          features = JSON.parse(data.features);
        } else if (Array.isArray(data.features)) {
          features = data.features;
        }
      } catch {
        features = [];
      }

      // Determine category
      let category = 'Property';
      const listingType = data.listingType || 'sale';
      if (listingType === 'sale') {
        if (data.type === 'house') category = 'Houses for Sale';
        if (data.type === 'apartment') category = 'Sales Apartments';
        if (data.type === 'plot') category = 'Land/Plot Sales';
        if (data.type === 'commercial') category = 'Commercial Sales';
        if (data.type === 'car') category = 'Vehicles';
      } else {
        if (data.type === 'house') category = 'Houses for Rent';
        if (data.type === 'apartment') category = 'Apartments for Rent';
        if (data.type === 'commercial') category = 'Commercial Rentals';
      }

      const formattedProperty: Property = {
        id: data.id,
        title: data.title,
        type: data.type as any,
        status: data.status || 'available',
        listingType: listingType as 'rent' | 'sale',
        category,
        price: data.price,
        currency: data.currency,
        location: data.location,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        size: data.size,
        images,
        description: data.description || "No description available.",
        features,
        agent: {
          name: "D.E.F Real Estate Team",
          phone: "+250 788 909 960",
          email: "dusabeyezuemmanuel99@gmail.com"
        },
        addedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
      };

      setProperty(formattedProperty);

      // Fetch similar properties
      const similarResponse = await fetch('/api/properties');
      const similarData = await similarResponse.json();
      const similar = (similarData.properties || similarData)
        .filter((p: any) => p.id !== id)
        .slice(0, 3)
        .map((p: any) => {
          let simImage = "";
          if (p.images) {
            try {
              const simImages = JSON.parse(p.images);
              if (simImages.length > 0) simImage = simImages[0];
            } catch (e) {
              simImage = p.images;
            }
          }
          // Determine category for similar property
          let simCategory = 'Property';
          const simListingType = p.listingType || 'sale';
          if (simListingType === 'sale') {
            if (p.type === 'house') simCategory = 'Houses for Sale';
            if (p.type === 'apartment') simCategory = 'Sales Apartments';
            if (p.type === 'plot') simCategory = 'Land/Plot Sales';
            if (p.type === 'commercial') simCategory = 'Commercial Sales';
            if (p.type === 'car') simCategory = 'Vehicles';
          } else {
            if (p.type === 'house') simCategory = 'Houses for Rent';
            if (p.type === 'apartment') simCategory = 'Apartments for Rent';
            if (p.type === 'commercial') simCategory = 'Commercial Rentals';
          }
          return {
            id: p.id,
            title: p.title,
            type: p.type,
            status: p.status || 'available',
            listingType: simListingType,
            category: simCategory,
            price: p.price,
            currency: p.currency,
            location: p.location,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            size: p.size,
            image: simImage,
            agent: "D.E.F Real Estate Team",
            addedDate: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
          };
        });
      setSimilarProperties(similar);

    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          propertyId: id,
        }),
      });
      alert('Thank you! Your inquiry has been sent.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending inquiry:', error);
      alert('Failed to send inquiry. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="py-12 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-[500px] bg-gray-200 rounded-xl mb-8" />
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
              <div className="flex gap-6">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="py-12 bg-[#F5F5F5]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-[#0B1F3A] mb-4">Property Not Found</h1>
          <p className="text-[#6B7280]">The property you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }

  const hasMultipleImages = property.images.length > 1;

  return (
    <main className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Content */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="mb-8">
              {/* Main Image */}
              <div 
                className="h-[500px] bg-[#0B1F3A] rounded-xl mb-4 relative flex items-center justify-center overflow-hidden cursor-pointer group"
                onClick={() => hasMultipleImages && setIsLightboxOpen(true)}
              >
                {property.images.length > 0 && !imageErrors[selectedImage] ? (
                  <Image
                    src={property.images[selectedImage]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    onError={() => setImageErrors(prev => ({ ...prev, [selectedImage]: true }))}
                    unoptimized={!property.images[selectedImage].startsWith('/')}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[#C9A84C] text-6xl mb-4">{getPropertyEmoji(property.type)}</span>
                    <span className="text-white text-lg">No images available</span>
                  </div>
                )}

                {/* Navigation Arrows */}
                {hasMultipleImages && property.images.length > 0 && !imageErrors[selectedImage] && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ◀
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ▶
                    </button>
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg">
                      {selectedImage + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {property.images.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {property.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`h-20 rounded-lg cursor-pointer overflow-hidden relative bg-[#0B1F3A] ${selectedImage === idx ? 'ring-2 ring-[#C9A84C]' : 'opacity-70 hover:opacity-100'}`}
                    >
                      {!imageErrors[idx] ? (
                        <Image
                          src={img}
                          alt={`Property image ${idx + 1}`}
                          fill
                          className="object-cover"
                          onError={() => setImageErrors(prev => ({ ...prev, [idx]: true }))}
                          unoptimized={!img.startsWith('/')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C9A84C] text-xl">
                          {getPropertyEmoji(property.type)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title and Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="badge-category">{property.category}</span>
                <span className={property.listingType === 'rent' ? 'badge-rent' : 'badge-sale'}>
                  {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                {property.status === 'sold' && <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Sold</span>}
                {property.status === 'pending' && <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">In Talks</span>}
              </div>
              <h1 className="text-3xl font-bold text-[#0B1F3A] mb-2">{property.title}</h1>
              <p className="text-[#6B7280] flex items-center gap-2 mb-4">📍 {property.location}</p>
              {property.type !== 'plot' && property.type !== 'car' && (
                <div className="flex gap-6 text-[#6B7280]">
                  {property.bedrooms && <span>🛏️ {property.bedrooms} Beds</span>}
                  {property.bathrooms && <span>🚿 {property.bathrooms} Baths</span>}
                  {property.size && <span>📐 {property.size} sqm</span>}
                </div>
              )}
              {property.type === 'car' && (
                <div className="flex gap-6 text-[#6B7280]">
                  {/* We don't have car fields but let's add placeholders if needed */}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-[#0B1F3A] mb-4">Description</h2>
              <p className="text-[#6B7280] whitespace-pre-line">{property.description}</p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-[#0B1F3A] mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#6B7280]">
                      <span className="text-[#C9A84C]">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-1/3">
            {/* Price Box */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <p className="text-3xl font-bold text-[#0B1F3A] mb-4">
                {property.price != null ? (
                  <>
                    {property.currency === 'FRW'
                      ? `${property.price.toLocaleString()} FRW`
                      : `$${property.price.toLocaleString()}`
                    }
                    {property.listingType === 'rent' && <span className="text-xl font-normal">/month</span>}
                  </>
                ) : (
                  'Price on request'
                )}
              </p>
              <div className="flex flex-col gap-3">
                <a href={`tel:${property.agent.phone}`} className="btn-primary w-full text-center">📞 Contact Agent</a>
                <a
                  href={`https://wa.me/250788909960?text=Hello%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-center"
                >
                  💬 WhatsApp
                </a>
                <button className="border border-[#C9A84C] text-[#C9A84C] rounded-lg py-3 px-4 hover:bg-[#C9A84C] hover:text-white transition-colors">♡ Save Property</button>
              </div>
            </div>

            {/* Agent Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">Agent Info</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#C9A84C] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  D
                </div>
                <div>
                  <p className="font-semibold text-[#0B1F3A]">{property.agent.name}</p>
                </div>
              </div>
              <div className="space-y-2 text-[#6B7280]">
                <p className="flex items-center gap-2">📞 {property.agent.phone}</p>
                <p className="flex items-center gap-2">✉️ {property.agent.email}</p>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">Send Inquiry</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                />
                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#0B1F3A] mb-6">Similar Properties</h2>
            <div className="space-y-6">
              {similarProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && property.images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            ×
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/30"
          >
            ◀
          </button>
          <div className="relative w-[90vw] h-[80vh]">
            {!imageErrors[selectedImage] ? (
              <Image
                src={property.images[selectedImage]}
                alt={property.title}
                fill
                className="object-contain"
                onError={() => setImageErrors(prev => ({ ...prev, [selectedImage]: true }))}
                unoptimized={!property.images[selectedImage].startsWith('/')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[#C9A84C] text-8xl">{getPropertyEmoji(property.type)}</span>
              </div>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/30"
          >
            ▶
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
            {selectedImage + 1} / {property.images.length}
          </div>
        </div>
      )}
    </main>
  );
}

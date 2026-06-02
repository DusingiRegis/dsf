'use client';

import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inquirySchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

// Dummy properties data (same as properties page)
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
    description: 'Stunning modern villa with breathtaking views. This luxurious property features 4 bedrooms, 3 bathrooms, a swimming pool, and beautifully landscaped gardens.',
    images: JSON.stringify([
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20modern%20villa%20exterior&image_size=square_hd',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20modern%20living%20room&image_size=square_hd',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20modern%20kitchen&image_size=square_hd',
    ]),
    videos: JSON.stringify(['https://www.youtube.com/watch?v=dQw4w9WgXcQ']),
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
    description: 'Charming family home in a quiet suburban neighborhood with a large backyard and updated kitchen.',
    images: JSON.stringify([
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cozy%20suburban%20family%20home&image_size=square_hd',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20family%20kitchen&image_size=square_hd',
    ]),
    videos: JSON.stringify([]),
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
    description: 'Premium waterfront lot perfect for building your dream home with stunning ocean views.',
    images: JSON.stringify([
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=waterfront%20land%20plot&image_size=square_hd',
    ]),
    videos: JSON.stringify([]),
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
    description: 'Luxurious penthouse apartment in the heart of Manhattan with panoramic city views.',
    images: JSON.stringify([
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20downtown%20penthouse&image_size=square_hd',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20penthouse%20interior&image_size=square_hd',
    ]),
    videos: JSON.stringify(['https://vimeo.com/148751763']),
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
    description: 'Scenic mountain view lot with breathtaking views of the Rockies.',
    images: JSON.stringify([
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20view%20land%20plot&image_size=square_hd',
    ]),
    videos: JSON.stringify([]),
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
    description: 'Beautiful beachfront home with direct access to the sand.',
    images: JSON.stringify([
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=beachfront%20modern%20house&image_size=square_hd',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=beachfront%20house%20interior&image_size=square_hd',
    ]),
    videos: JSON.stringify([]),
  },
];

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(inquirySchema) });

  // Fetch property
  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setProperty(data);
        } else {
          const dummy = DUMMY_PROPERTIES.find((p) => p.id === id) || DUMMY_PROPERTIES[0];
          setProperty(dummy);
        }
        setLoading(false);
      })
      .catch(() => {
        const dummy = DUMMY_PROPERTIES.find((p) => p.id === id) || DUMMY_PROPERTIES[0];
        setProperty(dummy);
        setLoading(false);
      });
  }, [id]);

  const onSubmit = async (data: any) => {
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, propertyId: id }),
      });
      reset();
      alert('Inquiry sent successfully!');
    } catch (error) {
      console.error('Error sending inquiry:', error);
    }
  };

  // Helper to parse images
  const getImages = (images: any) => {
    if (typeof images === 'string') {
      try {
        return JSON.parse(images);
      } catch {
        return [];
      }
    }
    return images || [];
  };

  // Helper to parse videos
  const getVideos = (videos: any) => {
    if (typeof videos === 'string') {
      try {
        return JSON.parse(videos);
      } catch {
        return [];
      }
    }
    return videos || [];
  };

  if (loading || !property) {
    return (
      <main className="container mx-auto px-4 py-12">
        <p className="text-center text-muted text-xl">Loading...</p>
      </main>
    );
  }

  const images = getImages(property.images);
  const videos = getVideos(property.videos);
  const firstImage = images[0] || 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=property%20placeholder&image_size=square_hd';

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Image Gallery */}
        <div>
          <div className="h-96 bg-cover bg-center rounded-xl mb-4" style={{ backgroundImage: `url(${firstImage})` }}></div>
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {images.slice(1).map((url: string, idx: number) => (
                <div key={idx} className="h-24 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${url})` }}></div>
              ))}
            </div>
          )}

          {/* Video Gallery */}
          {videos.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Videos</h3>
              <div className="space-y-4">
                {videos.map((url: string, idx: number) => {
                  // Try to extract YouTube video ID for embedding
                  let videoSrc = url;
                  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                  if (youtubeMatch) {
                    videoSrc = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
                  }
                  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
                  if (vimeoMatch) {
                    videoSrc = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
                  }

                  return (
                    <div key={idx} className="rounded-xl overflow-hidden">
                      <iframe
                        src={videoSrc}
                        title={`Property video ${idx + 1}`}
                        className="w-full h-64"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold capitalize">{property.type}</span>
            <span className="text-muted">• {property.size} sqft</span>
          </div>
          <h1 className="font-serif text-4xl font-bold mb-4">{property.title}</h1>
          <p className="text-primary text-3xl font-bold mb-6">${property.price.toLocaleString()}</p>
          <p className="text-muted flex items-center gap-2 mb-6">
            <span>📍</span> {property.location}
          </p>
          
          {property.bedrooms && (
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2">
                <span>🛏️</span> {property.bedrooms} Beds
              </div>
              <div className="flex items-center gap-2">
                <span>🛁</span> {property.bathrooms} Baths
              </div>
            </div>
          )}

          <p className="text-muted mb-8">{property.description}</p>

          {/* Inquiry Form */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-serif text-xl font-semibold mb-4">Inquire About This Property</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input {...register('name')} className="w-full border rounded-lg px-4 py-2" />
                {errors.name && <p className="text-danger text-sm">{errors.name.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input {...register('email')} type="email" className="w-full border rounded-lg px-4 py-2" />
                {errors.email && <p className="text-danger text-sm">{errors.email.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input {...register('phone')} type="tel" className="w-full border rounded-lg px-4 py-2" />
                {errors.phone && <p className="text-danger text-sm">{errors.phone.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea {...register('message')} rows={4} className="w-full border rounded-lg px-4 py-2" />
                {errors.message && <p className="text-danger text-sm">{errors.message.message as string}</p>}
              </div>
              <Button type="submit" className="w-full">Send Inquiry</Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

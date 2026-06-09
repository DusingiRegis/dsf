'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CarDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const navigateImage = (direction: number) => {
    if (!car) return;
    setSelectedImage(prev => {
      let next = prev + direction;
      let images = [] as string[];
      try { images = JSON.parse(car.images); } catch { images = []; }
      if (next < 0) next = images.length - 1;
      if (next >= images.length) next = 0;
      return next;
    });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isLightboxOpen) return;
    if (e.key === 'Escape') setIsLightboxOpen(false);
    if (e.key === 'ArrowLeft') navigateImage(-1);
    if (e.key === 'ArrowRight') navigateImage(1);
  }, [isLightboxOpen, car]);

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

  // Fetch car data
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        const data = await response.json();
        if (response.ok) {
          setCar(data);
        } else {
          console.error('Error fetching car:', data.error);
        }
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
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
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="h-[500px] bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
              <div className="bg-white p-6 rounded-xl shadow-sm mb-6 animate-pulse">
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-gray-200 rounded"></div>)}
                </div>
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-xl shadow-sm mb-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="py-12 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-[#6B7280] text-lg">Car not found.</p>
            <Link href="/cars" className="btn-primary mt-4 inline-block">
              Back to Cars
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Parse images
  let images = [] as string[];
  try {
    images = JSON.parse(car.images);
  } catch (e) {
    images = [];
  }

  // Parse features
  let features = [] as string[];
  try {
    if (typeof car.features === 'string') {
      features = JSON.parse(car.features);
    } else if (Array.isArray(car.features)) {
      features = car.features;
    }
  } catch (e) {
    features = [];
  }

  const formatCar = {
    id: car.id,
    title: car.title,
    brand: car.make || "Unknown",
    model: car.model || "Unknown",
    year: car.year || 2024,
    price: car.price,
    mileage: car.mileage || 0,
    fuelType: car.fuelType || "Unknown",
    transmission: car.transmission || "Unknown",
    color: car.color || "Unknown",
    engine: "Unknown",
    drive: "Unknown",
    status: car.listingType,
    currency: car.currency || "USD",
    images,
    description: car.description,
    features,
    agent: {
      name: "D.E.F Real Estate Team",
      phone: "+250 788 909 960",
      email: "dusabeyezuemmanuel99@gmail.com",
    },
    addedDate: car.createdAt ? new Date(car.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "",
  };

  const hasMultipleImages = formatCar.images.length > 1;

  return (
    <main className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Content */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="mb-8">
              <div 
                className="h-[500px] bg-[#0B1F3A] rounded-xl mb-4 relative flex items-center justify-center overflow-hidden cursor-pointer group"
                onClick={() => hasMultipleImages && setIsLightboxOpen(true)}
              >
                {formatCar.images.length > 0 && !imageErrors[selectedImage] ? (
                  <Image
                    src={formatCar.images[selectedImage]}
                    alt={formatCar.title}
                    fill
                    className="object-cover"
                    onError={() => setImageErrors(prev => ({ ...prev, [selectedImage]: true }))}
                    unoptimized={!formatCar.images[selectedImage].startsWith('/')}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[#C9A84C] text-6xl mb-4">🚗</span>
                    <span className="text-white text-lg">No images available</span>
                  </div>
                )}

                {/* Navigation Arrows */}
                {hasMultipleImages && formatCar.images.length > 0 && !imageErrors[selectedImage] && (
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
                      {selectedImage + 1} / {formatCar.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {formatCar.images.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {formatCar.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`h-20 rounded-lg cursor-pointer overflow-hidden relative bg-[#0B1F3A] ${selectedImage === idx ? 'ring-2 ring-[#C9A84C]' : 'opacity-70 hover:opacity-100'}`}
                    >
                      {!imageErrors[idx] ? (
                        <Image
                          src={img}
                          alt={`Car image ${idx + 1}`}
                          fill
                          className="object-cover"
                          onError={() => setImageErrors(prev => ({ ...prev, [idx]: true }))}
                          unoptimized={!img.startsWith('/')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C9A84C] text-xl">
                          🚗
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
                <span className="badge-category">{formatCar.brand}</span>
                <span className={formatCar.status === 'rent' ? 'badge-rent' : 'badge-sale'}>
                  {formatCar.status === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-[#0B1F3A] mb-2">{formatCar.title}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[#6B7280]">
                <div>📅 Year: {formatCar.year}</div>
                <div>⛽ Fuel: {formatCar.fuelType}</div>
                <div>⚙️ Transmission: {formatCar.transmission}</div>
                <div>🛣️ Mileage: {formatCar.mileage.toLocaleString()} km</div>
                <div>🎨 Color: {formatCar.color}</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-[#0B1F3A] mb-4">Description</h2>
              <p className="text-[#6B7280] whitespace-pre-line">{formatCar.description}</p>
            </div>

            {/* Features */}
            {formatCar.features.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-[#0B1F3A] mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formatCar.features.map((feature, idx) => (
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
                {formatCar.currency === 'USD' ? '$' : 'RWF '}{formatCar.price.toLocaleString()}
                {formatCar.status === 'rent' && <span className="text-lg font-normal">/month</span>}
              </p>
              <div className="flex flex-col gap-3">
                <a href={`tel:${formatCar.agent.phone}`} className="btn-primary w-full text-center">📞 Contact Agent</a>
                <a
                  href={`https://wa.me/250788909960?text=Hello%2C%20I%20am%20interested%20in%20${encodeURIComponent(formatCar.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-center"
                >
                  💬 WhatsApp
                </a>
                <button className="border border-[#C9A84C] text-[#C9A84C] rounded-lg py-3 px-4 hover:bg-[#C9A84C] hover:text-white transition-colors">♡ Save Car</button>
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
                  <p className="font-semibold text-[#0B1F3A]">{formatCar.agent.name}</p>
                </div>
              </div>
              <div className="space-y-2 text-[#6B7280]">
                <p className="flex items-center gap-2">📞 {formatCar.agent.phone}</p>
                <p className="flex items-center gap-2">✉️ {formatCar.agent.email}</p>
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
      </div>

      {/* Lightbox */}
      {isLightboxOpen && formatCar.images.length > 0 && (
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
                src={formatCar.images[selectedImage]}
                alt={formatCar.title}
                fill
                className="object-contain"
                onError={() => setImageErrors(prev => ({ ...prev, [selectedImage]: true }))}
                unoptimized={!formatCar.images[selectedImage].startsWith('/')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[#C9A84C] text-8xl">🚗</span>
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
            {selectedImage + 1} / {formatCar.images.length}
          </div>
        </div>
      )}
    </main>
  );
}

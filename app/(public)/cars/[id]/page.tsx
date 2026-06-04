'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

const dummyCar = {
  id: "1",
  title: "2023 Toyota Land Cruiser",
  brand: "Toyota",
  model: "Land Cruiser",
  year: 2023,
  price: 85000,
  mileage: 12000,
  fuelType: "Petrol",
  transmission: "Automatic",
  color: "White",
  engine: "3.5L V6",
  drive: "4WD",
  status: "sale" as const,
  images: [
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=toyota%20land%20cruiser%20white%20car%20front&image_size=landscape_16_9",
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=toyota%20land%20cruiser%20interior&image_size=landscape_16_9",
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=toyota%20land%20cruiser%20rear&image_size=landscape_16_9",
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=toyota%20land%20cruiser%20side&image_size=landscape_16_9",
  ],
  description: "Immaculate 2023 Toyota Land Cruiser in perfect condition. This luxury SUV features a powerful 3.5L V6 engine, 4WD, automatic transmission, and all the latest safety and comfort features. With only 12,000 km on the odometer, this vehicle is practically new and ready for its next owner.",
  features: ["Leather Seats", "Sunroof", "Navigation System", "Bluetooth", "Backup Camera", "Heated Seats", "Apple CarPlay", "Android Auto", "Cruise Control", "Keyless Entry"],
  agent: {
    name: "D.E.F Real Estate Team",
    phone: "+250 788 123 456",
    email: "info@defrealestate.com",
  },
  addedDate: "June 1, 2026",
};

const similarCars = [
  { id: "2", title: "2022 Mercedes-Benz C-Class", brand: "Mercedes", model: "C-Class", year: 2022, price: 65000, mileage: 25000, fuelType: "Petrol", transmission: "Automatic", status: "sale" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mercedes%20benz%20c%20class%20black%20car&image_size=landscape_16_9" },
  { id: "3", title: "2021 BMW X5", brand: "BMW", model: "X5", year: 2021, price: 58000, mileage: 35000, fuelType: "Diesel", transmission: "Automatic", status: "sale" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bmw%20x5%20suv%20car&image_size=landscape_16_9" },
];

export default function CarDetailPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! Your inquiry has been sent.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <main className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Content */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="mb-8">
              <div 
                className="h-96 bg-cover bg-center rounded-xl mb-4" 
                style={{ backgroundImage: `url(${dummyCar.images[selectedImage]})` }}
              />
              <div className="grid grid-cols-4 gap-2">
                {dummyCar.images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-24 bg-cover bg-center rounded-lg cursor-pointer ${selectedImage === idx ? 'ring-2 ring-[#C9A84C]' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>
            
            {/* Title and Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <div className="flex gap-2 mb-3">
                <span className="badge-category">{dummyCar.brand}</span>
                <span className={dummyCar.status === 'rent' ? 'badge-rent' : 'badge-sale'}>
                  {dummyCar.status === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-[#0B1F3A] mb-2">{dummyCar.title}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[#6B7280]">
                <div>📅 Year: {dummyCar.year}</div>
                <div>⛽ Fuel: {dummyCar.fuelType}</div>
                <div>⚙️ Transmission: {dummyCar.transmission}</div>
                <div>🛣️ Mileage: {dummyCar.mileage.toLocaleString()} km</div>
                <div>🎨 Color: {dummyCar.color}</div>
                <div>🔧 Engine: {dummyCar.engine}</div>
                <div>🚗 Drive: {dummyCar.drive}</div>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-[#0B1F3A] mb-4">Description</h2>
              <p className="text-[#6B7280]">{dummyCar.description}</p>
            </div>
            
            {/* Features */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-[#0B1F3A] mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dummyCar.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[#6B7280]">
                    <span className="text-[#C9A84C]">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="lg:w-1/3">
            {/* Price Box */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <p className="text-3xl font-bold text-[#0B1F3A] mb-4">${dummyCar.price.toLocaleString()}</p>
              <div className="flex flex-col gap-3">
                <button className="btn-primary w-full">📞 Contact Agent</button>
                <button className="btn-secondary w-full">💬 WhatsApp</button>
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
                  <p className="font-semibold text-[#0B1F3A]">{dummyCar.agent.name}</p>
                </div>
              </div>
              <div className="space-y-2 text-[#6B7280]">
                <p className="flex items-center gap-2">📞 {dummyCar.agent.phone}</p>
                <p className="flex items-center gap-2">✉️ {dummyCar.agent.email}</p>
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
        
        {/* Similar Cars */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#0B1F3A] mb-6">Similar Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {similarCars.map(car => (
              <Link 
                key={car.id} 
                href={`/cars/${car.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex"
              >
                <div 
                  className="w-1/2 h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${car.image})` }}
                />
                <div className="p-6 flex-1">
                  <div className="flex gap-2 mb-3">
                    <span className="badge-category">{car.brand}</span>
                    <span className={car.status === 'rent' ? 'badge-rent' : 'badge-sale'}>
                      {car.status === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0B1F3A] mb-2">{car.title}</h3>
                  <p className="text-[#6B7280] text-sm mb-2">{car.year} • {car.mileage.toLocaleString()} km</p>
                  <div className="flex gap-4 text-[#6B7280] text-sm mb-4">
                    <span>⛽ {car.fuelType}</span>
                    <span>⚙️ {car.transmission}</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0B1F3A]">${car.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

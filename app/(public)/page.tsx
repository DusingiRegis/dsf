'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchPanel from '@/components/public/SearchPanel';
import CategoryGrid from '@/components/public/CategoryGrid';
import PropertyCard from '@/components/public/PropertyCard';

const dummyCars: Array<{
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  status: 'rent' | 'sale';
  image: string;
}> = [
  {
    id: "1",
    title: "2023 Toyota Land Cruiser",
    brand: "Toyota",
    model: "Land Cruiser",
    year: 2023,
    price: 85000,
    mileage: 12000,
    fuelType: "Petrol",
    transmission: "Automatic",
    status: "sale",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=toyota%20land%20cruiser%20white%20car&image_size=landscape_16_9"
  },
  {
    id: "2",
    title: "2022 Mercedes-Benz C-Class",
    brand: "Mercedes",
    model: "C-Class",
    year: 2022,
    price: 65000,
    mileage: 25000,
    fuelType: "Petrol",
    transmission: "Automatic",
    status: "rent",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mercedes%20benz%20c%20class%20black%20car&image_size=landscape_16_9"
  },
  {
    id: "3",
    title: "2021 BMW X5",
    brand: "BMW",
    model: "X5",
    year: 2021,
    price: 58000,
    mileage: 35000,
    fuelType: "Diesel",
    transmission: "Automatic",
    status: "sale",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bmw%20x5%20suv%20car&image_size=landscape_16_9"
  },
  {
    id: "4",
    title: "2024 Honda CR-V",
    brand: "Honda",
    model: "CR-V",
    year: 2024,
    price: 45000,
    mileage: 5000,
    fuelType: "Hybrid",
    transmission: "Automatic",
    status: "rent",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=honda%20crv%20suv%20car&image_size=landscape_16_9"
  }
];

export default function HomePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      
      const formattedProperties = data.map((prop: any) => {
        let image = "https://coresg-normal.trae.ai/api/ide/v1/text-to-image?prompt=real%20estate%20property%20property%20estate&image_size=landscape_16_9";
        if (prop.images) {
          try {
            const imagesArray = JSON.parse(prop.images);
            if (imagesArray.length > 0) image = imagesArray[0];
          } catch (e) {
            image = prop.images;
          }
        }

        let category = "Property";
        if (prop.type === "house") category = "Houses for Sale";
        if (prop.type === "apartment") category = "Sales Apartments";
        if (prop.type === "plot") category = "Land/Plot Sales";
        if (prop.type === "commercial") category = "Commercial Sales";

        return {
          id: prop.id,
          title: prop.title,
          type: prop.type,
          status: prop.status,
          category: category,
          price: prop.price,
          currency: prop.currency || 'USD',
          location: prop.location,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          size: prop.size,
          image: image,
          agent: "D.E.F Real Estate Team",
          featured: prop.featured,
          addedDate: prop.createdAt ? new Date(prop.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
        };
      });

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);
  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20real%20estate%20hero%20background%20property&image_size=landscape_16_9')`
        }}
      >
        <div className="absolute inset-0 bg-[#0B1F3A]/80" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
              Find Your Perfect Property in Rwanda
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90">
              Houses, Apartments, Plots & Cars — All in One Place
            </p>
          </div>
          <SearchPanel />
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-4">
              Browse by Category
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Find exactly what you're looking for with our curated categories
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-4">
              Featured Properties
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Handpicked properties in prime locations
            </p>
          </div>
          {loading ? (
            <div className="space-y-6">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row animate-pulse">
                  <div className="w-full md:w-80 h-56 bg-gray-200" />
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex gap-2">
                      <div className="h-6 w-32 bg-gray-200 rounded-full" />
                      <div className="h-6 w-24 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-8 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="flex gap-4">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="space-y-6">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : null}
          <div className="text-center mt-10">
            <Link href="/properties" className="btn-ghost text-lg">
              View All Properties →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-4">
              Featured Cars
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Quality vehicles for every budget
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummyCars.map(car => (
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
                  <p className="text-[#6B7280] text-sm mb-2">
                    {car.year} • {car.mileage.toLocaleString()} km
                  </p>
                  <div className="flex gap-4 text-[#6B7280] text-sm mb-4">
                    <span>⛽ {car.fuelType}</span>
                    <span>⚙️ {car.transmission}</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0B1F3A]">${car.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/cars" className="btn-ghost text-lg">
              View All Cars →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-[#0B1F3A]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <h3 className="text-4xl font-bold text-[#C9A84C] mb-2">200+</h3>
              <p>Properties</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#C9A84C] mb-2">50+</h3>
              <p>Cars</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#C9A84C] mb-2">500+</h3>
              <p>Happy Clients</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#C9A84C] mb-2">8+</h3>
              <p>Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-4">
              What Our Clients Say
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Don't just take our word for it
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "John Doe", location: "Kigali", rating: 5, text: "Excellent service! Found my dream home in just 2 weeks." },
              { name: "Jane Smith", location: "Kiyovu", rating: 5, text: "Professional team and great selection of properties." },
              { name: "Robert Johnson", location: "Nyarutarama", rating: 5, text: "Smooth transaction from start to finish. Highly recommended!" },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-8">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#C9A84C]">⭐</span>
                  ))}
                </div>
                <p className="text-[#6B7280] mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#C9A84C] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1F3A]">{testimonial.name}</p>
                    <p className="text-[#6B7280] text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#C9A84C]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-4">
            Have a Property to List?
          </h2>
          <p className="text-[#0B1F3A]/80 text-lg mb-8 max-w-2xl mx-auto">
            Submit your property and reach thousands of buyers and renters.
          </p>
          <Link href="/admin/properties/new" className="btn-secondary bg-white text-[#0B1F3A] border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white text-lg px-8 py-3">
            Submit Property
          </Link>
        </div>
      </section>
    </main>
  );
}

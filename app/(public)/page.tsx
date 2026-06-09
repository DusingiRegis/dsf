'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchPanel from '@/components/public/SearchPanel';
import CategoryGrid from '@/components/public/CategoryGrid';
import PropertyCard from '@/components/public/PropertyCard';

export default function HomePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/properties?featured=true');
      const data = await response.json();
      
      const formattedProperties = (data.properties || data).map((prop: any) => {
        let image = "";
        if (prop.images) {
          // If it's already an array, use first element
          if (Array.isArray(prop.images)) {
            if (prop.images.length > 0) image = prop.images[0];
          } else if (typeof prop.images === 'string') {
            // If it's a string, try to parse
            try {
              const imagesArray = JSON.parse(prop.images);
              if (Array.isArray(imagesArray) && imagesArray.length > 0) image = imagesArray[0];
            } catch (e) {
              image = prop.images;
            }
          }
        }

        let category = "Property";
        if (prop.listingType === 'sale') {
          if (prop.type === "house") category = "Houses for Sale";
          if (prop.type === "apartment") category = "Sales Apartments";
          if (prop.type === "plot") category = "Land/Plot Sales";
          if (prop.type === "commercial") category = "Commercial Sales";
          if (prop.type === "car") category = "Vehicles";
        } else if (prop.listingType === 'rent') {
          if (prop.type === "house") category = "Houses for Rent";
          if (prop.type === "apartment") category = "Apartments for Rent";
          if (prop.type === "commercial") category = "Commercial Rentals";
        }

        return {
          id: prop.id,
          title: prop.title,
          type: prop.type,
          status: prop.status,
          listingType: prop.listingType,
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
      <section className="relative py-20 bg-[#0B1F3A]">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
              Find Your Perfect Property in Rwanda
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90">
              Houses, Apartments, Plots & More — All in One Place
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
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-[#6B7280] text-lg">No featured properties yet.</p>
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/properties" className="btn-ghost text-lg">
              View All Properties →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-[#0B1F3A]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <h3 className="text-4xl font-bold text-[#C9A84C] mb-2">10+</h3>
              <p>Properties</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-[#C9A84C] mb-2">5+</h3>
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
              { name: "Uwimana Alice", location: "Kigali", rating: 5, text: "I found my dream apartment through D.E.F Real Estate in less than a week. Very professional!" },
              { name: "Nkurunziza Patrick", location: "Nyarutarama", rating: 5, text: "Great team, smooth process. I sold my plot faster than expected." },
              { name: "Mukamana Grace", location: "Kiyovu", rating: 5, text: "Highly recommend! They helped me find a furnished rental that fit my budget perfectly." },
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
          <Link href="/submit-property" className="btn-secondary bg-white text-[#0B1F3A] border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white text-lg px-8 py-3">
            Submit Property
          </Link>
        </div>
      </section>
    </main>
  );
}

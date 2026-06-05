'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/public/Sidebar';
import PropertyCard from '@/components/public/PropertyCard';
import Pagination from '@/components/public/Pagination';
import CallWidget from '@/components/public/CallWidget';

interface Property {
  id: string;
  title: string;
  type: 'house' | 'apartment' | 'plot' | 'commercial';
  status: string;
  category: string;
  price: number;
  location: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size?: number | null;
  image: string;
  agent: string;
  featured: boolean;
  addedDate: string;
  features?: string[];
  images?: string;
  createdAt?: string;
}

const PROPERTIES_PER_PAGE = 10;

interface Filters {
  status: 'all' | 'available' | 'sold' | 'pending';
  type: 'all' | 'house' | 'apartment' | 'plot' | 'commercial' | 'furnished' | 'unfurnished';
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  features: string[];
  sort: 'newest' | 'price-low' | 'price-high';
}

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    type: 'all',
    location: '',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    bathrooms: null,
    features: [],
    sort: 'newest',
  });

  // Fetch properties from API
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type !== 'all' && filters.type !== 'furnished' && filters.type !== 'unfurnished') {
        params.set('type', filters.type);
      }
      if (filters.status !== 'all') {
        params.set('status', filters.status);
      }
      if (filters.location) {
        params.set('location', filters.location);
      }
      
      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();
      
      // Convert API data to our component format
      const formattedProperties = data.map((prop: any) => {
        // Parse images from JSON string
        let image = 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=real%20estate%20property%20placeholder&image_size=landscape_16_9';
        if (prop.images) {
          try {
            const imagesArray = JSON.parse(prop.images);
            if (imagesArray.length > 0) {
              image = imagesArray[0];
            }
          } catch (e) {
            image = prop.images;
          }
        }

        // Determine category based on type and status
        let category = 'Property';
        if (prop.type === 'house' && prop.status === 'available') category = 'Houses for Sale';
        if (prop.type === 'apartment' && prop.status === 'available') category = 'Sales Apartments';
        if (prop.type === 'plot' && prop.status === 'available') category = 'Land/Plot Sales';
        if (prop.type === 'commercial' && prop.status === 'available') category = 'Commercial Sales';
        
        return {
          id: prop.id,
          title: prop.title,
          type: prop.type as any,
          status: prop.status,
          category,
          price: prop.price,
          location: prop.location,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          size: prop.size,
          image,
          agent: 'D.E.F Real Estate Team',
          featured: prop.featured || false,
          addedDate: prop.createdAt ? new Date(prop.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
          images: prop.images
        };
      });
      
      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize filters from URL params
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const statusParam = searchParams.get('status');
    
    const newFilters: Filters = {
      status: (statusParam as 'available' | 'sold' | 'pending') || 'all',
      type: (typeParam as 'house' | 'apartment' | 'plot' | 'commercial' | 'furnished' | 'unfurnished') || 'all',
      location: searchParams.get('location') || '',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
      bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : null,
      bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : null,
      features: searchParams.get('features') ? searchParams.get('features')?.split(',') || [] : [],
      sort: (searchParams.get('sort') as 'newest' | 'price-low' | 'price-high') || 'newest',
    };
    setFilters(newFilters);
    setCurrentPage(1);
  }, [searchParams]);

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  // Filter properties
  const filteredProperties = properties.filter(property => {
    if (filters.status !== 'all' && property.status !== filters.status) return false;
    
    if (filters.type !== 'all') {
      if (filters.type === 'furnished') {
        if (!property.category.includes('Furnished')) return false;
      } else if (filters.type === 'unfurnished') {
        if (!property.category.includes('Unfurnished')) return false;
      } else if (property.type !== filters.type) {
        return false;
      }
    }
    
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.minPrice !== null && property.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && property.price > filters.maxPrice) return false;
    if (filters.bedrooms !== null && (property.bedrooms || 0) < filters.bedrooms) return false;
    if (filters.bathrooms !== null && (property.bathrooms || 0) < filters.bathrooms) return false;
    return true;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (filters.sort === 'price-low') return a.price - b.price;
    if (filters.sort === 'price-high') return b.price - a.price;
    // Default: newest
    return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / PROPERTIES_PER_PAGE);
  const currentProperties = sortedProperties.slice(
    (currentPage - 1) * PROPERTIES_PER_PAGE,
    currentPage * PROPERTIES_PER_PAGE
  );

  const handleFilterChange = (newFilters: Partial<Filters>, resetOtherFilters: boolean = false) => {
    let updatedFilters: Filters;
    if (resetOtherFilters) {
      // Reset all filters when switching tabs
      updatedFilters = {
        status: newFilters.status || 'all',
        type: 'all',
        location: '',
        minPrice: null,
        maxPrice: null,
        bedrooms: null,
        bathrooms: null,
        features: [],
        sort: 'newest',
      };
    } else {
      updatedFilters = { ...filters, ...newFilters };
    }
    
    setFilters(updatedFilters);
    setCurrentPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (updatedFilters.status !== 'all') params.set('status', updatedFilters.status);
    if (updatedFilters.type !== 'all') params.set('type', updatedFilters.type);
    if (updatedFilters.location) params.set('location', updatedFilters.location);
    if (updatedFilters.minPrice !== null) params.set('minPrice', updatedFilters.minPrice.toString());
    if (updatedFilters.maxPrice !== null) params.set('maxPrice', updatedFilters.maxPrice.toString());
    if (updatedFilters.bedrooms !== null) params.set('bedrooms', updatedFilters.bedrooms.toString());
    if (updatedFilters.bathrooms !== null) params.set('bathrooms', updatedFilters.bathrooms.toString());
    if (updatedFilters.features.length > 0) params.set('features', updatedFilters.features.join(','));
    if (updatedFilters.sort !== 'newest') params.set('sort', updatedFilters.sort);
    
    router.push(`/properties${params.toString() ? '?' + params.toString() : ''}`, { scroll: false });
  };

  const handleSortChange = (sort: string) => {
    let sortValue: 'newest' | 'price-low' | 'price-high' = 'newest';
    if (sort === 'Price: Low to High') sortValue = 'price-low';
    if (sort === 'Price: High to Low') sortValue = 'price-high';
    handleFilterChange({ sort: sortValue });
  };

  const getPageTitle = () => {
    if (filters.type === "furnished" && filters.status === "available") return "Furnished Available";
    if (filters.type === "unfurnished" && filters.status === "available") return "Unfurnished Available";
    if (filters.type === "apartment" && filters.status === "available") return "Available Apartments";
    if (filters.type === "commercial" && filters.status === "available") return "Commercial Available";
    if (filters.type === "house" && filters.status === "available") return "Houses for Sale";
    if (filters.type === "plot" && filters.status === "available") return "Plots / Land Sales";
    if (filters.type === "apartment" && filters.status === "available") return "Sales Apartments";
    if (filters.type === "commercial" && filters.status === "available") return "Commercial Sales";
    if (filters.status === "sold") return "Sold Out Properties";
    if (filters.status === "pending") return "In Talks Properties";
    if (filters.status === "available") return "Available Properties";
    return "All Properties";
  };

  return (
    <main className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-[#6B7280]">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <span className="mx-2">→</span>
          <Link href="/properties" className="hover:text-[#C9A84C] transition-colors">Properties</Link>
          {getPageTitle() !== "All Properties" && (
            <>
              <span className="mx-2">→</span>
              <span className="text-[#0B1F3A] font-medium">{getPageTitle()}</span>
            </>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-8">{getPageTitle()}</h1>

        {/* Available/Sold/In Talks Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => handleFilterChange({ status: 'all' }, true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filters.status === 'all'
                ? 'bg-[#C9A84C] text-white'
                : 'bg-white text-[#0B1F3A] hover:bg-[#C9A84C]/5'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange({ status: 'available' }, true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filters.status === 'available'
                ? 'bg-[#C9A84C] text-white'
                : 'bg-white text-[#0B1F3A] hover:bg-[#C9A84C]/5'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => handleFilterChange({ status: 'pending' }, true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filters.status === 'pending'
                ? 'bg-[#C9A84C] text-white'
                : 'bg-white text-[#0B1F3A] hover:bg-[#C9A84C]/5'
            }`}
          >
            In Talks
          </button>
          <button
            onClick={() => handleFilterChange({ status: 'sold' }, true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filters.status === 'sold'
                ? 'bg-[#C9A84C] text-white'
                : 'bg-white text-[#0B1F3A] hover:bg-[#C9A84C]/5'
            }`}
          >
            Sold Out
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Sidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
            <CallWidget />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sorting */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
              <p className="text-[#6B7280]">{sortedProperties.length} results</p>
              <select 
                className="w-full md:w-auto px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                value={
                  filters.sort === 'price-low' 
                    ? 'Price: Low to High' 
                    : filters.sort === 'price-high' 
                      ? 'Price: High to Low' 
                      : 'Sort by: Newest'
                }
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {/* Properties List */}
            <div className="space-y-6 mb-8">
              {loading ? (
                // Loading state
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row animate-pulse">
                      <div className="w-full md:w-80 h-56 md:h-auto bg-gray-200" />
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
              ) : currentProperties.length > 0 ? (
                currentProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <p className="text-[#6B7280] text-lg">No properties found matching your filters.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

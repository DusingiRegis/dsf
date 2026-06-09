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
  type: 'house' | 'apartment' | 'plot' | 'commercial' | 'car';
  status: string;
  listingType: string;
  category: string;
  price: number;
  currency?: string;
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
  furnished?: boolean | null;
}

const PROPERTIES_PER_PAGE = 10;

interface Filters {
  listingType: 'all' | 'rent' | 'sale';
  status: 'all' | 'rent' | 'sale' | 'available' | 'sold' | 'pending';
  type: 'all' | 'house' | 'apartment' | 'plot' | 'commercial' | 'furnished' | 'unfurnished' | 'car';
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  features: string[];
  sort: 'newest' | 'price-low' | 'price-high';
}

export default function PropertiesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    listingType: 'all',
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
      
      // Set all filter parameters
      if (filters.listingType !== 'all') params.set('listingType', filters.listingType);
      if (filters.status !== 'all') params.set('status', filters.status);
      if (filters.type !== 'all') params.set('type', filters.type);
      if (filters.location) params.set('location', filters.location);
      if (filters.minPrice !== null) params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== null) params.set('maxPrice', filters.maxPrice.toString());
      if (filters.bedrooms !== null) params.set('bedrooms', filters.bedrooms.toString());
      if (filters.bathrooms !== null) params.set('bathrooms', filters.bathrooms.toString());
      if (filters.features.length > 0) params.set('features', filters.features.join(','));
      if (filters.sort !== 'newest') params.set('sort', filters.sort);
      params.set('page', currentPage.toString());

      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();
      
      // Convert API data to our component format
      const formattedProperties = data.properties.map((prop: any) => {
        // Parse images from JSON string
        let image = '';
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

        // Determine category based on type and listingType
        let category = 'Property';
        if (prop.listingType === 'sale') {
          if (prop.type === 'house') category = 'Houses for Sale';
          if (prop.type === 'apartment') category = 'Sales Apartments';
          if (prop.type === 'plot') category = 'Land/Plot Sales';
          if (prop.type === 'commercial') category = 'Commercial Sales';
          if (prop.type === 'car') category = 'Vehicles';
        } else if (prop.listingType === 'rent') {
          if (prop.type === 'house') category = 'Houses for Rent';
          if (prop.type === 'apartment') {
            if (prop.furnished) category = 'Furnished Apartments';
            else category = 'Apartments for Rent';
          }
          if (prop.type === 'commercial') category = 'Commercial Rentals';
        }
        
        return {
          id: prop.id,
          title: prop.title,
          type: prop.type as any,
          status: prop.status,
          listingType: prop.listingType,
          category,
          price: prop.price,
          currency: prop.currency || 'USD',
          location: prop.location,
          bedrooms: prop.bedrooms ?? undefined,
          bathrooms: prop.bathrooms ?? undefined,
          size: prop.size,
          image,
          agent: 'D.E.F Real Estate Team',
          featured: prop.featured || false,
          addedDate: prop.createdAt ? new Date(prop.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
          images: prop.images,
          furnished: prop.furnished
        };
      });
      
      setProperties(formattedProperties);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Initialize filters from URL params
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const statusParam = searchParams.get('status');
    const listingTypeParam = searchParams.get('listingType');
    
    const newFilters: Filters = {
      listingType: (listingTypeParam as 'rent' | 'sale') || 'all',
      status: (statusParam as 'available' | 'sold' | 'pending') || 'all',
      type: (typeParam as 'house' | 'apartment' | 'plot' | 'commercial' | 'furnished' | 'unfurnished' | 'car') || 'all',
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

  // Fetch properties when filters or page change
  useEffect(() => {
    fetchProperties();
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    setFilters(updatedFilters);
    setCurrentPage(1);
    
    // Update URL params
    const params = new URLSearchParams();
    if (updatedFilters.listingType !== 'all') params.set('listingType', updatedFilters.listingType);
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
    const typeText = filters.listingType === 'rent' ? 'Rent' : 'Sale';
    if (filters.type === "furnished" && filters.status === "available") return `Furnished Available for ${typeText}`;
    if (filters.type === "unfurnished" && filters.status === "available") return `Unfurnished Available for ${typeText}`;
    if (filters.type === "apartment" && filters.status === "available") return `Available Apartments for ${typeText}`;
    if (filters.type === "commercial" && filters.status === "available") return `Commercial Available for ${typeText}`;
    if (filters.type === "house" && filters.status === "available") return `Houses for ${typeText}`;
    if (filters.type === "plot" && filters.status === "available") return `Plots / Land for ${typeText}`;
    if (filters.type === "car" && filters.status === "available") return `Vehicles for ${typeText}`;
    if (filters.status === "sold") return "Sold Out Properties";
    if (filters.status === "pending") return "In Talks Properties";
    if (filters.status === "available") return `Available Properties for ${typeText}`;
    if (filters.listingType === 'rent') return "All Rental Properties";
    if (filters.listingType === 'sale') return "All Properties for Sale";
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
              <p className="text-[#6B7280]">{totalCount} results</p>
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
              ) : properties.length > 0 ? (
                properties.map(property => (
                  <PropertyCard key={property.id} property={property as any} />
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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/public/Sidebar';

const CARS_PER_PAGE = 10;

type CarFilters = {
  status: "all" | "rent" | "sale";
  brand: "all" | string;
  minYear: number | null;
  maxYear: number | null;
  fuelTypes: string[];
  transmissions: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minMileage: number | null;
  maxMileage: number | null;
  sort: "newest" | "price-low" | "price-high" | "mileage-low" | "mileage-high";
};

export default function CarsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CarFilters>({
    status: "all",
    brand: "all",
    minYear: null,
    maxYear: null,
    fuelTypes: [],
    transmissions: [],
    minPrice: null,
    maxPrice: null,
    minMileage: null,
    maxMileage: null,
    sort: "newest",
  });

  // Fetch cars from API
  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("type", "car");
      
      if (filters.status !== "all") {
        params.set("listingType", filters.status);
      }
      if (filters.minPrice !== null) {
        params.set("minPrice", filters.minPrice.toString());
      }
      if (filters.maxPrice !== null) {
        params.set("maxPrice", filters.maxPrice.toString());
      }
      if (filters.sort !== "newest") {
        params.set("sort", filters.sort);
      }
      params.set("page", currentPage.toString());
      
      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();
      
      setCars(data.properties || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize filters from URL params
  useEffect(() => {
    const statusParam = searchParams.get("status");
    const brandParam = searchParams.get("brand");
    const minYearParam = searchParams.get("minYear");
    const maxYearParam = searchParams.get("maxYear");
    const fuelTypesParam = searchParams.get("fuelTypes");
    const transmissionsParam = searchParams.get("transmissions");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minMileageParam = searchParams.get("minMileage");
    const maxMileageParam = searchParams.get("maxMileage");
    const sortParam = searchParams.get("sort");

    const newFilters: CarFilters = {
      status: (statusParam as "rent" | "sale") || "all",
      brand: brandParam || "all",
      minYear: minYearParam ? Number(minYearParam) : null,
      maxYear: maxYearParam ? Number(maxYearParam) : null,
      fuelTypes: fuelTypesParam ? fuelTypesParam.split(",") : [],
      transmissions: transmissionsParam ? transmissionsParam.split(",") : [],
      minPrice: minPriceParam ? Number(minPriceParam) : null,
      maxPrice: maxPriceParam ? Number(maxPriceParam) : null,
      minMileage: minMileageParam ? Number(minMileageParam) : null,
      maxMileage: maxMileageParam ? Number(maxMileageParam) : null,
      sort: (sortParam as CarFilters["sort"]) || "newest",
    };

    setFilters(newFilters);
    setCurrentPage(1);
  }, [searchParams]);

  // Fetch cars when filters or page change
  useEffect(() => {
    fetchCars();
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters: Partial<CarFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);

    // Update URL params
    const params = new URLSearchParams();
    if (updatedFilters.status !== "all") params.set("status", updatedFilters.status);
    if (updatedFilters.brand !== "all") params.set("brand", updatedFilters.brand);
    if (updatedFilters.minYear) params.set("minYear", updatedFilters.minYear.toString());
    if (updatedFilters.maxYear) params.set("maxYear", updatedFilters.maxYear.toString());
    if (updatedFilters.fuelTypes.length > 0) params.set("fuelTypes", updatedFilters.fuelTypes.join(","));
    if (updatedFilters.transmissions.length > 0) params.set("transmissions", updatedFilters.transmissions.join(","));
    if (updatedFilters.minPrice) params.set("minPrice", updatedFilters.minPrice.toString());
    if (updatedFilters.maxPrice) params.set("maxPrice", updatedFilters.maxPrice.toString());
    if (updatedFilters.minMileage) params.set("minMileage", updatedFilters.minMileage.toString());
    if (updatedFilters.maxMileage) params.set("maxMileage", updatedFilters.maxMileage.toString());
    if (updatedFilters.sort !== "newest") params.set("sort", updatedFilters.sort);

    router.push(`/cars${params.toString() ? "?" + params.toString() : ""}`, { scroll: false });
  };

  // Format car data
  const formatCar = (property: any) => {
    const images = property.images ? JSON.parse(property.images) : [];
    return {
      id: property.id,
      title: property.title,
      brand: property.make || "Unknown",
      model: property.model || "Unknown",
      year: property.year || 2024,
      price: property.price,
      mileage: property.mileage || 0,
      fuelType: property.fuelType || "Unknown",
      transmission: property.transmission || "Unknown",
      status: property.listingType,
      image: images[0] || "",
      currency: property.currency || "USD",
    };
  };

  return (
    <main className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Sidebar 
              filters={{ ...filters, type: "car" } as any} 
              onFilterChange={handleFilterChange as any}
              useFor="cars"
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-8">Cars</h1>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
              <p className="text-[#6B7280]">{totalCount} results</p>
            </div>

            {/* Cars Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col animate-pulse">
                    <div className="w-full h-64 bg-[#0B1F3A]"></div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
                      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
                      <div className="mt-auto h-6 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map(property => {
                  const car = formatCar(property);
                  return (
                    <Link
                      key={car.id}
                      href={`/cars/${car.id}`}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                    >
                      <div className="w-full h-64 bg-[#0B1F3A] flex items-center justify-center flex-shrink-0 text-4xl text-[#C9A84C]">
                        {car.image ? (
                          <img
                            src={car.image}
                            alt={car.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "";
                              target.alt = "🚗";
                            }}
                          />
                        ) : (
                          "🚗"
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex gap-2 mb-3">
                          <span className="badge-category">{car.brand}</span>
                          <span className={car.status === 'rent' ? 'badge-rent' : 'badge-sale'}>
                            {car.status === 'rent' ? 'For Rent' : 'For Sale'}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-[#0B1F3A] mb-2">{car.title}</h3>
                        <p className="text-[#6B7280] mb-2">{car.year} • {car.transmission} • {car.fuelType}</p>
                        <div className="flex gap-4 text-[#6B7280] mb-4">
                          <span>📍 {car.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="mt-auto flex justify-between items-center">
                          <div className="text-2xl font-bold text-[#0B1F3A]">
                            {car.currency === 'USD' ? '$' : 'RWF '}{car.price.toLocaleString()}
                            {car.status === 'rent' && <span className="text-lg font-normal">/month</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-[#6B7280] text-lg">No cars found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

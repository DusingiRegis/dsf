'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/public/Sidebar';

const dummyCars = [
  { id: "1", title: "2023 Toyota Land Cruiser", brand: "Toyota", model: "Land Cruiser", year: 2023, price: 85000, mileage: 12000, fuelType: "Petrol", transmission: "Automatic", status: "sale" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=toyota%20land%20cruiser%20white%20car&image_size=landscape_16_9" },
  { id: "2", title: "2022 Mercedes-Benz C-Class", brand: "Mercedes", model: "C-Class", year: 2022, price: 65000, mileage: 25000, fuelType: "Petrol", transmission: "Automatic", status: "sale" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mercedes%20benz%20c%20class%20black%20car&image_size=landscape_16_9" },
  { id: "3", title: "2021 BMW X5", brand: "BMW", model: "X5", year: 2021, price: 58000, mileage: 35000, fuelType: "Diesel", transmission: "Automatic", status: "sale" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bmw%20x5%20suv%20car&image_size=landscape_16_9" },
  { id: "4", title: "2024 Honda CR-V", brand: "Honda", model: "CR-V", year: 2024, price: 45000, mileage: 5000, fuelType: "Hybrid", transmission: "Automatic", status: "sale" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=honda%20crv%20suv%20car&image_size=landscape_16_9" },
  { id: "5", title: "2020 Ford Ranger", brand: "Ford", model: "Ranger", year: 2020, price: 35000, mileage: 60000, fuelType: "Diesel", transmission: "Manual", status: "sale" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ford%20ranger%20pickup%20car&image_size=landscape_16_9" },
  { id: "6", title: "2023 Hyundai Tucson", brand: "Hyundai", model: "Tucson", year: 2023, price: 40000, mileage: 18000, fuelType: "Petrol", transmission: "Automatic", status: "sale" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=hyundai%20tucson%20suv%20car&image_size=landscape_16_9" },
  { id: "7", title: "2022 Toyota Corolla (Rent)", brand: "Toyota", model: "Corolla", year: 2022, price: 500, mileage: 20000, fuelType: "Petrol", transmission: "Automatic", status: "rent" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=toyota%20corolla%20silver%20car&image_size=landscape_16_9" },
  { id: "8", title: "2021 Honda Civic (Rent)", brand: "Honda", model: "Civic", year: 2021, price: 450, mileage: 30000, fuelType: "Petrol", transmission: "CVT", status: "rent" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=honda%20civic%20blue%20car&image_size=landscape_16_9" },
  { id: "9", title: "2023 Kia Sportage (Rent)", brand: "Kia", model: "Sportage", year: 2023, price: 600, mileage: 10000, fuelType: "Hybrid", transmission: "Automatic", status: "rent" as const, image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=kia%20sportage%20red%20suv%20car&image_size=landscape_16_9" },
];

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
  maxMileage: number | null;
  sort: "newest" | "price-low" | "price-high" | "mileage-low";
};

export default function CarsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CarFilters>({
    status: "all",
    brand: "all",
    minYear: null,
    maxYear: null,
    fuelTypes: [],
    transmissions: [],
    minPrice: null,
    maxPrice: null,
    maxMileage: null,
    sort: "newest"
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize from URL params
  useEffect(() => {
    const statusParam = searchParams.get('status');
    setFilters({
      status: (statusParam as "rent" | "sale") || "all",
      brand: "all",
      minYear: null,
      maxYear: null,
      fuelTypes: [],
      transmissions: [],
      minPrice: null,
      maxPrice: null,
      maxMileage: null,
      sort: "newest"
    });
    setCurrentPage(1);
  }, [searchParams]);
  
  // Filter cars
  const filteredCars = dummyCars.filter(car => {
    // Status filter
    if (filters.status !== "all" && car.status !== filters.status) return false;
    
    // Brand filter
    if (filters.brand !== "all" && car.brand !== filters.brand) return false;
    
    // Year filter
    if (filters.minYear !== null && car.year < filters.minYear) return false;
    if (filters.maxYear !== null && car.year > filters.maxYear) return false;
    
    // Fuel type filter
    if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) return false;
    
    // Transmission filter
    if (filters.transmissions.length > 0 && !filters.transmissions.includes(car.transmission)) return false;
    
    // Price filter
    if (filters.minPrice !== null && car.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && car.price > filters.maxPrice) return false;
    
    // Mileage filter
    if (filters.maxMileage !== null && car.mileage > filters.maxMileage) return false;
    
    return true;
  });
  
  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (filters.sort) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "mileage-low":
        return a.mileage - b.mileage;
      case "newest":
      default:
        return b.year - a.year;
    }
  });
  
  const totalPages = Math.ceil(sortedCars.length / CARS_PER_PAGE);
  const currentCars = sortedCars.slice(
    (currentPage - 1) * CARS_PER_PAGE,
    currentPage * CARS_PER_PAGE
  );
  
  const handleFilterChange = (newFilters: Partial<CarFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };
  
  const handleSortChange = (sortValue: string) => {
    let sort: CarFilters["sort"] = "newest";
    if (sortValue === "Price: Low to High") sort = "price-low";
    if (sortValue === "Price: High to Low") sort = "price-high";
    if (sortValue === "Mileage: Low to High") sort = "mileage-low";
    handleFilterChange({ sort });
  };
  
  const getPageTitle = () => {
    if (filters.status === "rent") return "Car Rentals";
    if (filters.status === "sale") return "Cars for Sale";
    return "All Cars";
  };

  // Custom sidebar for cars (since it has different fields)
  const CarSidebar = () => {
    const [tempFilters, setTempFilters] = useState<CarFilters>(filters);
    
    useEffect(() => {
      setTempFilters(filters);
    }, [filters]);
    
    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTempFilters(prev => ({ ...prev, brand: e.target.value }));
    };
    
    const handleMinYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempFilters(prev => ({ ...prev, minYear: e.target.value ? Number(e.target.value) : null }));
    };
    
    const handleMaxYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempFilters(prev => ({ ...prev, maxYear: e.target.value ? Number(e.target.value) : null }));
    };
    
    const handleFuelTypeToggle = (fuel: string) => {
      setTempFilters(prev => ({
        ...prev,
        fuelTypes: prev.fuelTypes.includes(fuel) 
          ? prev.fuelTypes.filter(f => f !== fuel) 
          : [...prev.fuelTypes, fuel]
      }));
    };
    
    const handleTransmissionToggle = (trans: string) => {
      setTempFilters(prev => ({
        ...prev,
        transmissions: prev.transmissions.includes(trans) 
          ? prev.transmissions.filter(t => t !== trans) 
          : [...prev.transmissions, trans]
      }));
    };
    
    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : null }));
    };
    
    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempFilters(prev => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : null }));
    };
    
    const handleMaxMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempFilters(prev => ({ ...prev, maxMileage: e.target.value ? Number(e.target.value) : null }));
    };
    
    const handleApply = () => {
      handleFilterChange(tempFilters);
    };
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">Filters</h3>
        
        <div className="mb-6">
          <label className="block text-[#6B7280] mb-2 font-medium">Brand</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={tempFilters.brand}
            onChange={handleBrandChange}
          >
            <option value="all">All Brands</option>
            <option value="Toyota">Toyota</option>
            <option value="Mercedes">Mercedes</option>
            <option value="BMW">BMW</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="Hyundai">Hyundai</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-[#6B7280] mb-2 font-medium">Year</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="From" 
              className="w-1/2 p-3 border border-gray-300 rounded-lg"
              value={tempFilters.minYear || ''}
              onChange={handleMinYearChange}
            />
            <input 
              type="number" 
              placeholder="To" 
              className="w-1/2 p-3 border border-gray-300 rounded-lg"
              value={tempFilters.maxYear || ''}
              onChange={handleMaxYearChange}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-[#6B7280] mb-2 font-medium">Fuel Type</label>
          <div className="space-y-2">
            {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((fuel) => (
              <label key={fuel} className="flex items-center gap-2 cursor-pointer text-[#6B7280]">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={tempFilters.fuelTypes.includes(fuel)}
                  onChange={() => handleFuelTypeToggle(fuel)}
                />
                {fuel}
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-[#6B7280] mb-2 font-medium">Transmission</label>
          <div className="space-y-2">
            {['Automatic', 'Manual', 'CVT'].map((trans) => (
              <label key={trans} className="flex items-center gap-2 cursor-pointer text-[#6B7280]">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={tempFilters.transmissions.includes(trans)}
                  onChange={() => handleTransmissionToggle(trans)}
                />
                {trans}
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-[#6B7280] mb-2 font-medium">Price Range</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              className="w-1/2 p-3 border border-gray-300 rounded-lg"
              value={tempFilters.minPrice || ''}
              onChange={handleMinPriceChange}
            />
            <input 
              type="number" 
              placeholder="Max" 
              className="w-1/2 p-3 border border-gray-300 rounded-lg"
              value={tempFilters.maxPrice || ''}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-[#6B7280] mb-2 font-medium">Max Mileage</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Max km" 
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={tempFilters.maxMileage || ''}
              onChange={handleMaxMileageChange}
            />
          </div>
        </div>
        
        <button 
          onClick={handleApply}
          className="w-full bg-[#C9A84C] hover:bg-[#B8973D] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Apply Filters
        </button>
      </div>
    );
  };

  return (
    <main className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-4 text-[#6B7280]">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <span className="mx-2">→</span>
          <Link href="/cars" className="hover:text-[#C9A84C] transition-colors">Cars</Link>
          {getPageTitle() !== "All Cars" && (
            <>
              <span className="mx-2">→</span>
              <span className="text-[#0B1F3A] font-medium">{getPageTitle()}</span>
            </>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-8">{getPageTitle()}</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              const params = new URLSearchParams();
              router.push(`/cars${params.toString() ? "?" + params.toString() : ""}`);
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filters.status === "all"
                ? "bg-[#C9A84C] text-white"
                : "bg-white text-[#0B1F3A] hover:bg-[#C9A84C]/5"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              const params = new URLSearchParams();
              params.set("status", "rent");
              router.push(`/cars?${params.toString()}`);
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filters.status === "rent"
                ? "bg-[#C9A84C] text-white"
                : "bg-white text-[#0B1F3A] hover:bg-[#C9A84C]/5"
            }`}
          >
            Rentals
          </button>
          <button
            onClick={() => {
              const params = new URLSearchParams();
              params.set("status", "sale");
              router.push(`/cars?${params.toString()}`);
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              filters.status === "sale"
                ? "bg-[#C9A84C] text-white"
                : "bg-white text-[#0B1F3A] hover:bg-[#C9A84C]/5"
            }`}
          >
            Sales
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <CarSidebar />
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sorting */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
              <p className="text-[#6B7280]">{sortedCars.length} results</p>
              <select 
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={
                  filters.sort === "price-low" 
                    ? "Price: Low to High" 
                    : filters.sort === "price-high" 
                      ? "Price: High to Low" 
                      : filters.sort === "mileage-low" 
                        ? "Mileage: Low to High" 
                        : "Sort by: Newest"
                }
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Mileage: Low to High</option>
              </select>
            </div>
            
            {/* Cars List */}
            <div className="space-y-6 mb-8">
              {currentCars.map(car => (
                <Link 
                  key={car.id} 
                  href={`/cars/${car.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col md:flex-row"
                >
                  <div 
                    className="w-full md:w-1/3 h-48 bg-cover bg-center"
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
                    <div className="flex gap-6 text-[#6B7280] mb-4">
                      <span>⛽ {car.fuelType}</span>
                      <span>⚙️ {car.transmission}</span>
                      <span>🛣️ {car.mileage.toLocaleString()} km</span>
                    </div>
                    <p className="text-2xl font-bold text-[#0B1F3A]">${car.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-[#C9A84C] hover:text-[#C9A84C]">Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page 
                        ? 'bg-[#C9A84C] text-white' 
                        : 'border border-gray-300 hover:border-[#C9A84C] hover:text-[#C9A84C]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-[#C9A84C] hover:text-[#C9A84C]">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

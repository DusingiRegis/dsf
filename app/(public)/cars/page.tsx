'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

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

export default function CarsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "all" as "all" | "rent" | "sale"
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize from URL params
  useEffect(() => {
    const statusParam = searchParams.get('status');
    setFilters({
      status: (statusParam as "rent" | "sale") || "all"
    });
    setCurrentPage(1);
  }, [searchParams]);
  
  // Filter cars
  const filteredCars = dummyCars.filter(car => {
    if (filters.status !== "all" && car.status !== filters.status) return false;
    return true;
  });
  
  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);
  const currentCars = filteredCars.slice(
    (currentPage - 1) * CARS_PER_PAGE,
    currentPage * CARS_PER_PAGE
  );
  
  const getPageTitle = () => {
    if (filters.status === "rent") return "Car Rentals";
    if (filters.status === "sale") return "Cars for Sale";
    return "All Cars";
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">Filters</h3>
              
              <div className="mb-6">
                <label className="block text-[#6B7280] mb-2 font-medium">Brand</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg">
                  <option>All Brands</option>
                  <option>Toyota</option>
                  <option>Mercedes</option>
                  <option>BMW</option>
                  <option>Honda</option>
                  <option>Ford</option>
                  <option>Hyundai</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-[#6B7280] mb-2 font-medium">Year</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="From" className="w-1/2 p-3 border border-gray-300 rounded-lg" />
                  <input type="number" placeholder="To" className="w-1/2 p-3 border border-gray-300 rounded-lg" />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-[#6B7280] mb-2 font-medium">Fuel Type</label>
                <div className="space-y-2">
                  {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((fuel) => (
                    <label key={fuel} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      {fuel}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-[#6B7280] mb-2 font-medium">Transmission</label>
                <div className="space-y-2">
                  {['Automatic', 'Manual'].map((trans) => (
                    <label key={trans} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      {trans}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-[#6B7280] mb-2 font-medium">Price Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-1/2 p-3 border border-gray-300 rounded-lg" />
                  <input type="number" placeholder="Max" className="w-1/2 p-3 border border-gray-300 rounded-lg" />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-[#6B7280] mb-2 font-medium">Mileage</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Max" className="w-full p-3 border border-gray-300 rounded-lg" />
                </div>
              </div>
              
              <button className="w-full btn-primary">Apply Filters</button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sorting */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
              <p className="text-[#6B7280]">{filteredCars.length} results</p>
              <select className="border border-gray-300 rounded-lg px-4 py-2">
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

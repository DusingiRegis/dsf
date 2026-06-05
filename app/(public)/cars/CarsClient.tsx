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
  minMileage: number | null;
  maxMileage: number | null;
  sort: "newest" | "price-low" | "price-high" | "mileage-low" | "mileage-high";
};

export default function CarsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
    minMileage: null,
    maxMileage: null,
    sort: "newest",
  });

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

  // Filter cars
  const filteredCars = dummyCars.filter(car => {
    if (filters.status !== "all" && car.status !== filters.status) return false;
    if (filters.brand !== "all" && car.brand !== filters.brand) return false;
    if (filters.minYear && car.year < filters.minYear) return false;
    if (filters.maxYear && car.year > filters.maxYear) return false;
    if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) return false;
    if (filters.transmissions.length > 0 && !filters.transmissions.includes(car.transmission)) return false;
    if (filters.minPrice && car.price < filters.minPrice) return false;
    if (filters.maxPrice && car.price > filters.maxPrice) return false;
    if (filters.minMileage && car.mileage < filters.minMileage) return false;
    if (filters.maxMileage && car.mileage > filters.maxMileage) return false;
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
      case "mileage-high":
        return b.mileage - a.mileage;
      default:
        return b.year - a.year;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCars.length / CARS_PER_PAGE);
  const currentCars = sortedCars.slice(
    (currentPage - 1) * CARS_PER_PAGE,
    currentPage * CARS_PER_PAGE
  );

  return (
    <main className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - we'll reuse the same component for now */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">Cars Filters</h3>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-8">Cars</h1>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentCars.map(car => (
                <Link 
                  key={car.id} 
                  href={`/cars/${car.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                >
                  <div 
                    className="w-full h-64 bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${car.image})` }}
                  />
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
                        ${car.price.toLocaleString()}
                        {car.status === 'rent' && <span className="text-lg font-normal">/month</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

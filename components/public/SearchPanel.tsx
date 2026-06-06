'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchPanel() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/properties');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
            <option>Status: All</option>
            <option>For Rent</option>
            <option>For Sale</option>
          </select>
          <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
            <option>Type: All Types</option>
            <option>House</option>
            <option>Apartment</option>
            <option>Plot</option>
            <option>Commercial</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
            <option>Min Price</option>
            <option>$10,000</option>
            <option>$50,000</option>
            <option>$100,000</option>
            <option>$200,000</option>
          </select>
          <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
            <option>Max Price</option>
            <option>$100,000</option>
            <option>$300,000</option>
            <option>$500,000</option>
            <option>$1,000,000</option>
          </select>
          <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
            <option>Min Beds</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
          <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
            <option>Min Baths</option>
            <option>1</option>
            <option>2</option>
            <option>3+</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Keywords..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
          />
          <button type="submit" className="w-full sm:w-auto bg-[#C9A84C] hover:bg-[#B8973D] px-6 py-3 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2">
            🔍 Search
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-[#0B1F3A] hover:text-[#C9A84C] transition-colors flex items-center gap-2 font-medium"
        >
          {showAdvanced ? '▴' : '▾'} Advanced Search
        </button>
        {showAdvanced && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            {['Garden', 'Swimming Pool', 'Security', 'WiFi', 'On Tarmac Road', 'Good View', 'Near Bus Station'].map((feature, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]" />
                {feature}
              </label>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}

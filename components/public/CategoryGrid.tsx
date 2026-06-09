import Link from 'next/link';

const categories = [
  {
    name: 'Furnished Rentals',
    link: '/properties?type=furnished&status=rent',
  },
  {
    name: 'Rental Apartment',
    link: '/properties?type=apartment&status=rent',
  },
  {
    name: 'Unfurnished Rentals',
    link: '/properties?type=unfurnished&status=rent',
  },
  {
    name: 'Commercial Rentals',
    link: '/properties?type=commercial&status=rent',
  },
  {
    name: 'Sales Apartment',
    link: '/properties?type=apartment&status=sale',
  },
  {
    name: 'Houses for Sale',
    link: '/properties?type=house&status=sale',
  },
  {
    name: 'Land/Plot Sales',
    link: '/properties?type=plot&status=sale',
  },
  {
    name: 'Commercial Sales',
    link: '/properties?type=commercial&status=sale',
  },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {categories.map((category, index) => (
        <Link
          key={index}
          href={category.link}
          className="p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-4 cursor-pointer group"
        >
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-28 h-28 rounded-full border-4 border-[#C9A84C] flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.6)]">
              {/* Inner Ring */}
              <div className="w-24 h-24 rounded-full border-2 border-[#C9A84C]/50 bg-white flex items-center justify-center">
                <span className="text-[#0B1F3A] font-bold uppercase text-xs text-center leading-tight px-2">
                  {category.name}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

import Link from 'next/link';

const categories = [
  {
    name: 'Furnished Rentals',
    link: '/properties?type=furnished',
    emoji: '🛋️',
    color: '#1e3a5f',
  },
  {
    name: 'Rental Apartments',
    link: '/properties?type=apartment&status=rent',
    emoji: '🏢',
    color: '#2d5a4f',
  },
  {
    name: 'Unfurnished Rentals',
    link: '/properties?type=unfurnished',
    emoji: '🏠',
    color: '#3a4d6f',
  },
  {
    name: 'Commercial Rentals',
    link: '/properties?type=commercial&status=rent',
    emoji: '🏪',
    color: '#2f4a6a',
  },
  {
    name: 'Sales Apartments',
    link: '/properties?type=apartment&status=sale',
    emoji: '🏘️',
    color: '#1f3f5f',
  },
  {
    name: 'Houses for Sale',
    link: '/properties?type=house&status=sale',
    emoji: '🏡',
    color: '#2a4a6a',
  },
  {
    name: 'Land/Plot Sales',
    link: '/properties?type=plot&status=sale',
    emoji: '🌳',
    color: '#3a6f4a',
  },
  {
    name: 'Cars for Sale',
    link: '/cars?status=sale',
    emoji: '🚗',
    color: '#5f3a4f',
  },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <Link
          key={index}
          href={category.link}
          className="relative h-56 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
        >
          <div
            className="absolute inset-0 flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundColor: category.color }}
          >
            {category.emoji}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] to-transparent" />
          <div className="absolute inset-0 flex items-end p-6">
            <h3 className="text-white text-xl font-semibold group-hover:text-[#C9A84C] transition-colors">{category.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

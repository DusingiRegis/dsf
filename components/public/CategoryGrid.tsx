import Link from 'next/link';

const categories = [
  {
    name: 'Furnished Rentals',
    link: '/properties?type=furnished',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20furnished%20apartment%20interior%20real%20estate&image_size=square_hd',
  },
  {
    name: 'Rental Apartments',
    link: '/properties?type=apartment&status=rent',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=apartment%20building%20exterior%20real%20estate&image_size=square_hd',
  },
  {
    name: 'Unfurnished Rentals',
    link: '/properties?type=unfurnished',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=empty%20house%20unfurnished%20interior%20real%20estate&image_size=square_hd',
  },
  {
    name: 'Commercial Rentals',
    link: '/properties?type=commercial&status=rent',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=office%20building%20commercial%20real%20estate&image_size=square_hd',
  },
  {
    name: 'Sales Apartments',
    link: '/properties?type=apartment&status=sale',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20for%20sale%20real%20estate&image_size=square_hd',
  },
  {
    name: 'Houses for Sale',
    link: '/properties?type=house&status=sale',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20house%20for%20sale%20real%20estate&image_size=square_hd',
  },
  {
    name: 'Land/Plot Sales',
    link: '/properties?type=plot&status=sale',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=land%20plot%20real%20estate&image_size=square_hd',
  },
  {
    name: 'Cars for Sale',
    link: '/cars?status=sale',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cars%20for%20sale%20dealership&image_size=square_hd',
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
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${category.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] to-transparent" />
          <div className="absolute inset-0 flex items-end p-6">
            <h3 className="text-white text-xl font-semibold group-hover:text-[#C9A84C] transition-colors">{category.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

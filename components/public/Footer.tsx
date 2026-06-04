import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0B1F3A] text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#C9A84C] rounded-lg flex items-center justify-center font-bold text-xl">
                D
              </div>
              <span className="font-bold text-xl">D.E.F Real Estate</span>
            </div>
            <p className="text-gray-300 mb-4">
              Find your dream property with our comprehensive real estate platform.
            </p>
            <div className="space-y-2 text-gray-300 mb-4">
              <p className="flex items-center gap-2">📞 +250 788 123 456</p>
              <p className="flex items-center gap-2">✉️ info@defrealestate.com</p>
              <p className="flex items-center gap-2">📍 Kigali, Rwanda</p>
            </div>
            <div className="flex gap-3">
              {['📘', '🐦', '📸', '📌'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#C9A84C] transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Rentals</h4>
            <ul className="space-y-3">
              {['Furnished Rentals', 'Unfurnished Rentals', 'Rental Apartments', 'Commercial Rentals'].map((link, i) => (
                <li key={i}>
                  <Link href="#" className="text-gray-300 hover:text-[#C9A84C] transition-colors flex items-center gap-2">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Sales</h4>
            <ul className="space-y-3">
              {['Houses for Sale', 'Plots / Land Sales', 'Sales Apartments', 'Commercial Sales'].map((link, i) => (
                <li key={i}>
                  <Link href="#" className="text-gray-300 hover:text-[#C9A84C] transition-colors flex items-center gap-2">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Useful Links</h4>
            <ul className="space-y-3">
              {['About Us', 'Contact Us', 'Submit Property', 'Login', 'Privacy Policy', 'Terms & Conditions'].map((link, i) => (
                <li key={i}>
                  <Link href="#" className="text-gray-300 hover:text-[#C9A84C] transition-colors flex items-center gap-2">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <h4 className="text-lg font-semibold">Subscribe to our newsletter</h4>
            <div className="flex flex-1 max-w-xl gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
              />
              <button className="bg-[#C9A84C] hover:bg-[#B8973D] text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 D.E.F Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

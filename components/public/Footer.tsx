import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-accent">EstateHub</h3>
            <p className="text-gray-300 mb-4">
              Find your dream property with our comprehensive real estate platform.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-xl">📘</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-xl">🐦</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-xl">📷</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/properties" className="hover:text-white transition-colors">Properties</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/properties" className="hover:text-white transition-colors">Houses</Link></li>
              <li><Link href="/properties" className="hover:text-white transition-colors">Plots</Link></li>
              <li><Link href="/properties" className="hover:text-white transition-colors">Commercial</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📍 123 Real Estate Ave, Suite 100</li>
              <li>📞 (555) 123-4567</li>
              <li>✉️ info@estatehub.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2025 EstateHub. All rights reserved. </p>
        </div>
      </div>
    </footer>
  );
}

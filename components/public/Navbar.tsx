'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold">
            EstateHub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/properties" className="hover:text-accent transition-colors">Properties</Link>
            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-3 pb-4">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 hover:text-accent transition-colors"
            >
              Home
            </Link>
            <Link
              href="/properties"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 hover:text-accent transition-colors"
            >
              Properties
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 hover:text-accent transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 hover:text-accent transition-colors"
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

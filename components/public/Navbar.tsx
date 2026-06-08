'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setIsMenuOpen(false);
  }, [pathname, searchParams]);

  const navItems: Array<
    | {
        name: string;
        href: string;
        isHome: true;
        dropdownName?: never;
        mobileDropdownName?: never;
        links?: never;
      }
    | {
        name: string;
        href?: never;
        isHome?: never;
        dropdownName: string;
        mobileDropdownName: string;
        links: Array<{ name: string; href: string }>;
      }
  > = [
    { name: 'Home', href: '/', isHome: true },
    {
      name: 'About',
      dropdownName: 'about',
      mobileDropdownName: 'mobile-about',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Why Choose Us', href: '/about#why' },
        { name: 'Our Services', href: '/about#services' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      name: 'Rentals',
      dropdownName: 'rentals',
      mobileDropdownName: 'mobile-rentals',
      links: [
        { name: 'Furnished Rentals', href: '/properties?type=furnished&status=rent' },
        { name: 'Unfurnished Rentals', href: '/properties?type=unfurnished&status=rent' },
        { name: 'Rental Apartments', href: '/properties?type=apartment&status=rent' },
      ],
    },
    {
      name: 'Sales',
      dropdownName: 'sales',
      mobileDropdownName: 'mobile-sales',
      links: [
        { name: 'Houses for Sale', href: '/properties?type=house&status=sale' },
        { name: 'Plots / Land Sales', href: '/properties?type=plot&status=sale' },
        { name: 'Sales Apartments', href: '/properties?type=apartment&status=sale' },
      ],
    },
    {
      name: 'Cars',
      dropdownName: 'cars',
      mobileDropdownName: 'mobile-cars',
      links: [
        { name: 'Cars for Sale', href: '/cars?status=sale' },
        { name: 'Car Rentals', href: '/cars?status=rent' },
      ],
    },
  ];

  const checkActiveLink = (href: string) => {
    if (href === '/') return pathname === href;

    const [basePath, query] = href.split('?');
    if (!query) return pathname.startsWith(basePath ?? href);

    const hrefParams = new URLSearchParams(query);
    const hrefStatus = hrefParams.get('status');
    const currentStatus = searchParams.get('status');

    const pathMatches = pathname.startsWith(basePath ?? href);
    const statusMatches = !hrefStatus || hrefStatus === currentStatus;

    return pathMatches && statusMatches;
  };

  return (
    <nav
      ref={navRef}
      className={`bg-[#0B1F3A] shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-xl py-1' : 'py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
          >
            <Image
              src="/logo6.png"
              alt="D.E.F Real Estate Logo"
              width={60}
              height={60}
              className="rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 object-contain"
            />
            <span className="font-bold text-lg sm:text-xl text-white whitespace-nowrap">D.E.F Real Estate</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if ('isHome' in item) {
                const href = item.href as string;
                const isActive = checkActiveLink(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-[#C9A84C] bg-[#C9A84C]/20'
                        : 'text-white hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 active:bg-[#C9A84C]/20 active:scale-95'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }

              const allLinks = item.links;
              const isAnyLinkActive = allLinks.some((link) => checkActiveLink(link.href));
              return (
                <div
                  key={item.dropdownName}
                  className="relative"
                  onMouseEnter={() => {
                    if (closeTimer.current) clearTimeout(closeTimer.current);
                    setOpenDropdown(item.dropdownName);
                  }}
                  onMouseLeave={() => {
                    closeTimer.current = setTimeout(() => setOpenDropdown(null), 100);
                  }}
                >
                  <button
                    onClick={() => toggleDropdown(item.dropdownName)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                      isAnyLinkActive
                        ? 'text-[#C9A84C] bg-[#C9A84C]/20'
                        : 'text-white hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 active:bg-[#C9A84C]/20 active:scale-95'
                    }`}
                  >
                    {item.name}
                    <span
                      className={`transition-transform duration-200 ${
                        openDropdown === item.dropdownName ? 'rotate-180' : ''
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                  <div
                    className={`absolute top-full left-0 mt-2 bg-white shadow-xl rounded-2xl p-2 w-56 z-[100] transition-all duration-200 transform origin-top ${
                      openDropdown === item.dropdownName
                        ? 'scale-100 opacity-100 visible'
                        : 'scale-95 opacity-0 invisible'
                    }`}
                  >
                    {item.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                          checkActiveLink(link.href)
                            ? 'text-[#C9A84C] bg-[#C9A84C]/10'
                            : 'text-[#6B7280] hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 active:bg-[#C9A84C]/10 active:scale-98'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            <Link
              href="/contact"
              className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                checkActiveLink('/contact')
                  ? 'text-[#C9A84C] bg-[#C9A84C]/20'
                  : 'text-white hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 active:bg-[#C9A84C]/20 active:scale-95'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white text-2xl transition-all duration-200 hover:text-[#C9A84C] hover:scale-110 active:scale-95 p-2 rounded-lg cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 border-t border-gray-700 pt-4 transition-all duration-300 transform origin-top bg-[#0B1F3A]">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                if ('isHome' in item) {
                  const href = item.href as string;
                  const isActive = checkActiveLink(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'text-[#C9A84C] bg-[#C9A84C]/20'
                          : 'text-white hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 active:bg-[#C9A84C]/20 active:scale-98'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                }

                return (
                  <div key={item.mobileDropdownName}>
                    <button
                      onClick={() => toggleDropdown(item.mobileDropdownName)}
                      className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex justify-between items-center cursor-pointer hover:bg-gray-800 active:bg-gray-700 active:scale-98"
                    >
                      <span className={(() => {
                        const allLinks = item.links;
                        return allLinks.some((link) => checkActiveLink(link.href)) ? 'text-[#C9A84C]' : 'text-white';
                      })()}>
                        {item.name}
                      </span>
                      <span className="transition-transform duration-200 text-white">
                        {openDropdown === item.mobileDropdownName ? '▾' : '▸'}
                      </span>
                    </button>
                    {openDropdown === item.mobileDropdownName && (
                      <div className="pl-4 mt-1 flex flex-col gap-1 transition-all duration-200">
                        {item.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                              checkActiveLink(link.href)
                                ? 'text-[#C9A84C] bg-[#C9A84C]/20'
                                : 'text-gray-300 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 active:bg-[#C9A84C]/20 active:scale-98'
                            }`}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  checkActiveLink('/contact')
                    ? 'text-[#C9A84C] bg-[#C9A84C]/20'
                    : 'text-white hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 active:bg-[#C9A84C]/20 active:scale-98'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function NavbarWithSuspense() {
  return (
    <Suspense fallback={null}>
      <Navbar />
    </Suspense>
  );
}
import Link from 'next/link';

export default function TopBar() {
  return (
    <div className="w-full bg-[#08172b] text-white px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:+250788909960"
            className="flex items-center gap-1 text-xs sm:text-sm text-white hover:text-[#C9A84C]"
          >
            📞 +250 788 909 960
          </a>
          <a
            href="mailto:dusabeyezuemmanuel99@gmail.com"
            className="flex items-center gap-1 text-xs sm:text-sm text-white hover:text-[#C9A84C]"
          >
            ✉️ dusabeyezuemmanuel99@gmail.com
          </a>
        </div>
        <div className="flex-shrink-0">
          <Link 
            href="/admin/properties/new"
            className="bg-[#C9A84C] hover:bg-[#B8973D] text-xs sm:text-sm px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors"
          >
            Submit Property
          </Link>
        </div>
      </div>
    </div>
  );
}

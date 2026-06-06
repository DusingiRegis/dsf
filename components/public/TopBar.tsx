import Link from 'next/link';

export default function TopBar() {
  return (
    <div className="w-full bg-[#08172b] text-white px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="text-sm hidden sm:block flex items-center gap-2">
            <span>📞</span> +250 788 909 960
          </span>
          <span className="text-sm hidden md:block flex items-center gap-2">
            <span>✉️</span> dusabeyezuemmanuel99@gmail.com
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link 
            href="/admin/properties/new"
            className="bg-[#C9A84C] hover:bg-[#B8973D] px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
          >
            Submit Property
          </Link>
        </div>
      </div>
    </div>
  );
}

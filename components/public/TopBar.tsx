import Link from 'next/link';

export default function TopBar() {
  return (
    <div className="bg-[#08172b] text-white px-6 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-2">
            <span>📞</span> +250 788 909 960
          </span>
          <span className="flex items-center gap-2">
            <span>✉️</span> dusabeyezuemmanuel99@gmail.com
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/properties/new"
            className="bg-[#C9A84C] hover:bg-[#B8973D] px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            Submit Property
          </Link>
        </div>
      </div>
    </div>
  );
}

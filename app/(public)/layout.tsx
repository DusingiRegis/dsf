import type { Metadata } from 'next';
import TopBar from '@/components/public/TopBar';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export const metadata: Metadata = {
  title: 'D.E.F Real Estate - Find Your Dream Property',
  description: 'Discover the perfect property with D.E.F Real Estate. Browse houses and plots for sale.',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

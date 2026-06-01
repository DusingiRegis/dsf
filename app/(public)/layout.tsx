import type { Metadata } from 'next';
import '../globals.css';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export const metadata: Metadata = {
  title: 'EstateHub - Find Your Dream Property',
  description: 'Discover the perfect property with EstateHub. Browse houses and plots for sale.',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

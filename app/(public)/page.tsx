import Link from 'next/link';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';

export default async function HomePage() {
  let featuredProperties: any[] = [];
  try {
    featuredProperties = await prisma.property.findMany({
      where: { featured: true },
      take: 6,
    });
  } catch (error) {
    console.log("Database not available yet, skipping featured properties");
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20modern%20house%20with%20garden%20real%20estate%20hero&image_size=landscape_16_9')` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">Find Your Dream Property</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">Discover exceptional houses and plots in prime locations</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button size="lg">Browse Properties</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-primary">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div>
              <h3 className="text-4xl font-bold text-accent mb-2">150+</h3>
              <p className="opacity-90">Properties</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-accent mb-2">500+</h3>
              <p className="opacity-90">Happy Clients</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-accent mb-2">10+</h3>
              <p className="opacity-90">Years Experience</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-accent mb-2">25+</h3>
              <p className="opacity-90">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-muted max-w-2xl mx-auto">Handpicked properties in prime locations</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${JSON.parse(property.images)[0] || ''})` }}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl font-semibold">{property.title}</h3>
                    <span className="bg-accent text-primary px-3 py-1 rounded-full text-sm font-semibold capitalize">{property.type}</span>
                  </div>
                  <p className="text-primary text-2xl font-bold mb-2">${property.price.toLocaleString()}</p>
                  <p className="text-muted flex items-center gap-2">
                    <span>📍</span> {property.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted max-w-2xl mx-auto">Your journey to finding the perfect property starts here</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">1</div>
              <h3 className="font-serif text-xl font-semibold mb-2">Search Properties</h3>
              <p className="text-muted">Browse our extensive list of houses and plots</p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">2</div>
              <h3 className="font-serif text-xl font-semibold mb-2">Inquire Now</h3>
              <p className="text-muted">Contact us for more details on any property</p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">3</div>
              <h3 className="font-serif text-xl font-semibold mb-2">Close the Deal</h3>
              <p className="text-muted">Our team will help you through every step</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

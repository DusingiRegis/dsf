export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-8 text-center">About EstateHub</h1>
      
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-muted mb-4">
            Founded in 2014, EstateHub has been helping families find their dream homes for over a decade.
          </p>
          <p className="text-muted">
            We believe that everyone deserves a place they can call home, and we are committed to making the
            property buying process as smooth and enjoyable as possible.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted">
            To provide exceptional service, expert guidance, and a seamless experience in finding and securing
            the perfect property.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold mb-4">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'John Doe', role: 'CEO & Founder' },
              { name: 'Jane Smith', role: 'Head of Sales' },
              { name: 'Mike Johnson', role: 'Senior Agent' },
            ].map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-xl text-center shadow-md">
                <div className="w-24 h-24 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">👤</div>
                <h3 className="font-serif text-xl font-semibold">{member.name}</h3>
                <p className="text-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

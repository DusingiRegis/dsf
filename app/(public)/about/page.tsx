export default function AboutPage() {
  return (
    <main className="bg-[#F5F5F5] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#0B1F3A] mb-12">About D.E.F Real Estate</h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Our Story */}
          <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4" id="about">Our Story</h2>
            <p className="text-[#6B7280] mb-4">
              Founded in 2018, D.E.F Real Estate has been helping families find their dream homes in Rwanda for over 8 years.
            </p>
            <p className="text-[#6B7280]">
              We believe that everyone deserves a place they can call home, and we are committed to making the
              property buying and renting process as smooth and enjoyable as possible.
            </p>
          </section>

          {/* Why Choose Us */}
          <section className="bg-white rounded-xl shadow-sm p-8 mb-8" id="why">
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-6">Why Choose Us</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🏠', title: 'Wide Selection', desc: 'Thousands of properties to choose from' },
                { icon: '🤝', title: 'Expert Agents', desc: 'Professional and experienced team' },
                { icon: '⭐', title: 'Trusted Service', desc: '5-star rating from happy clients' },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 bg-[#F5F5F5] rounded-lg">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-[#0B1F3A] mb-2">{item.title}</h3>
                  <p className="text-[#6B7280]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Services */}
          <section className="bg-white rounded-xl shadow-sm p-8 mb-8" id="services">
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-6">Our Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: '🏘️', title: 'Property Sales', desc: 'Buy and sell properties with ease' },
                { icon: '🏡', title: 'Property Rentals', desc: 'Find the perfect rental for you' },
                { icon: '🚗', title: 'Car Sales & Rentals', desc: 'Quality vehicles available' },
                { icon: '📋', title: 'Property Management', desc: 'Comprehensive management services' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-3xl text-[#C9A84C]">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B1F3A] mb-2">{item.title}</h3>
                    <p className="text-[#6B7280]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Our Team */}
          <section className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-6">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'John Doe', role: 'CEO & Founder' },
                { name: 'Jane Smith', role: 'Head of Sales' },
                { name: 'Mike Johnson', role: 'Senior Agent' },
              ].map((member, i) => (
                <div key={i} className="text-center p-6 bg-[#F5F5F5] rounded-lg">
                  <div className="w-24 h-24 bg-[#C9A84C] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-semibold text-[#0B1F3A]">{member.name}</h3>
                  <p className="text-[#6B7280]">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

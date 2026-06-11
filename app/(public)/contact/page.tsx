'use client';

export const revalidate = 60;

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Allow only numbers for phone fields
    if (name === 'phone') {
      const onlyNumbers = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNumbers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          propertyId: null, // General inquiry, no specific property
        }),
      });
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <main className="bg-[#F5F5F5] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#0B1F3A] mb-12">Contact Us</h1>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-6">Get In Touch</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#6B7280]">Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#6B7280]">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#6B7280]">Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#6B7280]">Message</label>
                <textarea 
                  rows={5} 
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-lg">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-[#0B1F3A] mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-[#C9A84C]">📍</div>
                  <div>
                    <h4 className="font-semibold text-[#0B1F3A]">Office Address</h4>
                    <p className="text-[#6B7280]">Kigali Heights, Kigali, Rwanda</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-[#C9A84C]">📞</div>
                  <div>
                    <h4 className="font-semibold text-[#0B1F3A]">Phone</h4>
                    <a href="tel:+250788909960" className="text-[#6B7280] hover:text-[#C9A84C]">+250 788 909 960</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-3xl text-[#C9A84C]">✉️</div>
                  <div>
                    <h4 className="font-semibold text-[#0B1F3A]">Email</h4>
                    <a href="mailto:dusabeyezuemmanuel99@gmail.com" className="text-[#6B7280] hover:text-[#C9A84C]">dusabeyezuemmanuel99@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-[#0B1F3A] mb-6">Business Hours</h3>
              <div className="space-y-2 text-[#6B7280]">
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

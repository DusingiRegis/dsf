'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SubmitPropertyPage() {
  const [formData, setFormData] = useState({
    ownerName: '',
    phoneNumber: '',
    email: '',
    propertyType: 'house',
    listingStatus: 'forSale',
    location: '',
    askingPrice: '',
    currency: 'RWF',
    bedrooms: '',
    bathrooms: '',
    description: '',
    preferredContact: 'phone',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Auto dismiss toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Allow only numbers for phone fields
    if (name === 'phoneNumber') {
      const onlyNumbers = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNumbers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      ownerName: '',
      phoneNumber: '',
      email: '',
      propertyType: 'house',
      listingStatus: 'forSale',
      location: '',
      askingPrice: '',
      currency: 'RWF',
      bedrooms: '',
      bathrooms: '',
      description: '',
      preferredContact: 'phone',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);
    
    try {
      const res = await fetch('/api/property-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setToast({
          type: 'success',
          message: 'Property submitted successfully! We\'ll contact you soon.'
        });
        resetForm();
      } else {
        const data = await res.json();
        setToast({
          type: 'error',
          message: data.error || 'Something went wrong, please try again'
        });
      }
    } catch (err) {
      console.error('Submit property error:', err);
      setToast({
        type: 'error',
        message: 'Something went wrong, please try again'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white transform transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } ${toast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        >
          <span className="text-2xl flex-shrink-0">
            {toast.type === 'success' ? '✓' : '✕'}
          </span>
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="text-white hover:opacity-70 transition-opacity text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      <main className="py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <Link href="/" className="inline-flex items-center gap-2 text-[#C9A84C] mb-4 hover:underline">
                ← Back
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-4">
                List Your Property With Us
              </h1>
              <p className="text-[#6B7280]">
                Fill in the form below and our team will contact you to discuss the next steps.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
            >
              {/* Owner Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    placeholder="+250 78x xxx xxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  placeholder="email@example.com"
                />
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Status *
                  </label>
                  <select
                    name="listingStatus"
                    value={formData.listingStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  >
                    <option value="forSale">For Sale</option>
                    <option value="forRent">For Rent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  placeholder="e.g. Kigali, Nyarutarama"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Asking Price *
                  </label>
                  <input
                    type="number"
                    name="askingPrice"
                    value={formData.askingPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    placeholder="Enter asking price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  >
                    <option value="RWF">RWF</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              {/* Bedrooms & Bathrooms - only show if not plot */}
              {formData.propertyType !== 'plot' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                      Number of Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                      placeholder="e.g. 4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                      Number of Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                      placeholder="e.g. 2"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                  Property Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none"
                  placeholder="Tell us about your property..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0B1F3A] mb-2">
                  Preferred Contact Method *
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#C9A84C]"
                    />
                    <span className="text-[#6B7280]">Phone</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="whatsapp"
                      checked={formData.preferredContact === 'whatsapp'}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#C9A84C]"
                    />
                    <span className="text-[#6B7280]">WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#C9A84C]"
                    />
                    <span className="text-[#6B7280]">Email</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#C9A84C] text-white py-4 rounded-lg font-semibold text-lg hover:bg-yellow-600 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

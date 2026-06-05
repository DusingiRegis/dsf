'use client';

import { useState } from 'react';

export default function CallWidget() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! We will call you soon!');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h3 className="text-lg font-semibold text-[#0B1F3A] mb-4">Let us call you</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
        />
        <input
          type="tel"
          placeholder="Your Phone"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
        />
        <button
          type="submit"
          className="w-full bg-[#C9A84C] hover:bg-[#B8973D] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Request Call Back
        </button>
      </form>
    </div>
  );
}

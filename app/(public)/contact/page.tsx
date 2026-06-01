'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inquirySchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(inquirySchema) });

  const onSubmit = async (data: any) => {
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      reset();
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-6">Get In Touch</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input {...register('name')} className="w-full border rounded-lg px-4 py-2" />
              {errors.name && <p className="text-danger text-sm">{errors.name.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input {...register('email')} type="email" className="w-full border rounded-lg px-4 py-2" />
              {errors.email && <p className="text-danger text-sm">{errors.email.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input {...register('phone')} type="tel" className="w-full border rounded-lg px-4 py-2" />
              {errors.phone && <p className="text-danger text-sm">{errors.phone.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea {...register('message')} rows={5} className="w-full border rounded-lg px-4 py-2" />
              {errors.message && <p className="text-danger text-sm">{errors.message.message as string}</p>}
            </div>
            <Button type="submit" size="lg">Send Message</Button>
          </form>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-xl font-semibold mb-2">Office Address</h3>
            <p className="text-muted">123 Real Estate Ave, Suite 100<br />Beverly Hills, CA 90210</p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold mb-2">Phone</h3>
            <p className="text-muted">(555) 123-4567</p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold mb-2">Email</h3>
            <p className="text-muted">info@estatehub.com</p>
          </div>
          <div className="h-64 bg-muted rounded-xl"></div>
        </div>
      </div>
    </main>
  );
}

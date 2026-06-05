import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const propertySchema = z.object({
  title: z.string().min(1),
  type: z.enum(['house', 'plot']),
  price: z.number().min(0),
  location: z.string().min(1),
  size: z.number().min(0),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  description: z.string().min(1),
  images: z.array(z.string()).min(1),
  status: z.enum(['available', 'sold']),
  featured: z.boolean().default(false),
});

export const inquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  message: z.string().min(1),
  propertyId: z.string().optional(),
});

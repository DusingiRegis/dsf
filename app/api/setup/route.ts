import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@defrealestate.com' },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin already exists!' });
    }

    // Create initial admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@defrealestate.com',
        password: hashedPassword,
        role: 'admin',
        isSuperAdmin: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Admin created successfully!',
      credentials: {
        email: 'admin@defrealestate.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Failed to setup admin' }, { status: 500 });
  }
}

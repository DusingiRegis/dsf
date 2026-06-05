const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking for admin...');
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@defrealestate.com' },
    });

    if (existingAdmin) {
      console.log('Admin already exists!');
      console.log('Email:', existingAdmin.email);
      return;
    }

    console.log('Creating admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@defrealestate.com',
        password: hashedPassword,
        role: 'admin',
        isSuperAdmin: true,
      },
    });
    console.log('Admin created successfully!');
    console.log('Email:', 'admin@defrealestate.com');
    console.log('Password:', 'admin123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

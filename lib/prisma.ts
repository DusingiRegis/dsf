// Safe Prisma client singleton
let prisma: any;

try {
  // Try to import PrismaClient
  const { PrismaClient } = require('@prisma/client');
  
  // Define global type
  const globalForPrisma = globalThis as unknown as {
    prisma: any;
  };

  prisma = globalForPrisma.prisma ?? new PrismaClient();

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
} catch (e) {
  // Fallback to dummy object if Prisma isn't set up
  console.log('⚠️ Prisma not fully set up yet; using dummy client');
  prisma = {
    property: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    inquiry: {
      findMany: async () => [],
      create: async () => ({}),
    },
    user: {
      findUnique: async () => null,
      upsert: async () => ({}),
    },
  };
}

export default prisma;

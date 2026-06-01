import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where:  { email: "admin@estatehub.com" },
    update: {},
    create: {
      email:    "admin@estatehub.com",
      password: hashed,
      role:     "admin",
    },
  });
  console.log("✅ Admin user seeded");
}

main().finally(() => prisma.$disconnect());

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const adapter =
  process.env.NODE_ENV === "production"
    ? new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
    : new PrismaPg({ connectionString: process.env.DATABASE_URL! });

export const prisma = new PrismaClient({ adapter });

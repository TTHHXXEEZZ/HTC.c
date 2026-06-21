import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaLibSql } from "@prisma/adapter-libsql";

let prisma;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || "file:./prisma/dev.db"
  });
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.globalPrisma) {
    const adapter = new PrismaLibSql({
      url: process.env.DATABASE_URL || "file:./prisma/dev.db"
    });
    global.globalPrisma = new PrismaClient({ adapter });
  }
  prisma = global.globalPrisma;
}

export { prisma };

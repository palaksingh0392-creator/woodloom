import "dotenv/config";

import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "@prisma/client";

const email = process.argv[2]?.trim().toLowerCase();
const databaseUrl = process.env.DATABASE_URL;

if (!email) {
  throw new Error("Usage: npm run admin:promote -- admin@example.com");
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMssql(databaseUrl),
});

async function main() {
  const user = await prisma.user.update({
    where: { email },
    data: {
      role: "ADMIN",
      status: "ACTIVE",
    },
    select: {
      email: true,
      name: true,
      role: true,
    },
  });

  console.log(`${user.name} (${user.email}) is now ${user.role}.`);
}

main()
  .catch((error) => {
    console.error(
      error instanceof Error ? error.message : "Unable to promote admin.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

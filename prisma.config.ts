import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "sqlserver://localhost:1433;database=woodloom;user=sa;password=YOUR_PASSWORD;encrypt=true;trustServerCertificate=true",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});

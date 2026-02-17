
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // `prisma db seed` reads seed command from here 
    seed: "node dist/prisma/seed.js",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});

import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'src/Infrastructure/Database/prisma/schema.prisma',
  migrations: {
    path: 'src/Infrastructure/Database/prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});

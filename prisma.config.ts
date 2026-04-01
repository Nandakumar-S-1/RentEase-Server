import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'src/infrastructure/database/prisma/schema.prisma',
    migrations: {
        path: 'src/infrastructure/database/prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL!,
    },
});

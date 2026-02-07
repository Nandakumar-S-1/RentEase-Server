//-------------Prisma 7 Client with Driver Adapter--------
// In Prisma 7, direct database connection requires a driver adapter

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Export Prisma client with the adapter
export const prisma = new PrismaClient({
    adapter
});
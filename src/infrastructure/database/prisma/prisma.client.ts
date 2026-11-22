// import { PrismaClient } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { Pool } from 'pg';

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
// });

// const adapter = new PrismaPg(pool);

// export const prisma = new PrismaClient({
//     adapter,
// });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Create connection pool for production reliability
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     max: 20, // Maximum connections in pool
//     idleTimeoutMillis: 30000, // Close idle connections after 30s
//     connectionTimeoutMillis: 2000, // Timeout after 2s if no connection available
//     maxUses: 7500, // Close connections after 7500 uses
// });

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

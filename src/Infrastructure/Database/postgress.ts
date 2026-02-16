//this file's job is to make sure that DB connection is ready, and handling connection,disconnection shutdowns etc.(like a switch that on and offs database)

import { logger } from '@shared/Log/logger';
import { prisma } from './prisma/prisma.client';

export async function connectToPostgressDB(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info(`successfully connected to db`);
  } catch (error) {
    logger.error(`db connection is'nt succesful. ${error}`);
    process.exit(1); //terminate the process
  }
}
export async function disconnectToPostgressDB(): Promise<void> {
  await prisma.$disconnect();
  logger.info(`successfully disconnected from db`);
}

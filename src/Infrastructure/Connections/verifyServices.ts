import { connectToRedis } from '@infrastructure/Cache/redis.client';
import { connectToPostgressDB } from '@infrastructure/Database/postgress';
import { MailService } from '@infrastructure/Services/MailService';
import { logger } from '@shared/Log/logger';
import { container } from 'tsyringe';

export async function verifyServices() {
  await connectToRedis(); //redis connection
  await connectToPostgressDB(); //db connection

  const mailService = container.resolve(MailService); //nodemailer otp connection
  await mailService.verifyConnection();
  logger.info('mailer has been connected correctly');
}

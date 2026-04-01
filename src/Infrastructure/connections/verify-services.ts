import { connectToRedis } from 'infrastructure/cache/redis.client';
import { connectToPostgressDB } from 'infrastructure/database/postgress';
import { MailService } from 'infrastructure/services/mail.service';
import { logger } from 'shared/log/logger';
import { container } from 'tsyringe';

export async function verifyServices() {
    await connectToRedis(); //redis connection
    await connectToPostgressDB(); //db connection

    const mailService = container.resolve(MailService); //nodemailer otp connection
    await mailService.verifyConnection();
    logger.info('mailer has been connected correctly');
}

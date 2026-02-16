import { IMailService } from '@application/Interfaces/User-Interfaces/IMailService ';
import { injectable } from 'tsyringe';
import nodemailer from 'nodemailer';
import { emailConfig } from '@infrastructure/Config/email.config';

@injectable()
export class MailService implements IMailService {
  private transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
    secure: emailConfig.secure,
  });

  async verifyConnection() {
    await this.transporter.verify();
  }

  async sendMail(to: string, otp: string) {
    await this.transporter.sendMail({
      from: `RentEas  ${emailConfig.user}`,
      to,
      subject: 'Your OTP',
      html: `<h2>${otp}</h2>`,
    });
  }
}

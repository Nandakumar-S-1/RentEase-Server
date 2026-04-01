import { IMailService } from 'application/interfaces/services/mail.service.interface';
import { injectable } from 'tsyringe';
import nodemailer from 'nodemailer';
import { emailConfig } from 'infrastructure/config/email.config';

@injectable()
export class MailService implements IMailService {
    private _transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        auth: {
            user: emailConfig.user,
            pass: emailConfig.pass,
        },
        secure: emailConfig.secure,
    });

    async verifyConnection() {
        await this._transporter.verify();
    }

    async sendMail(to: string, subject: string, html: string): Promise<void> {
        await this._transporter.sendMail({
            from: `RentEase  ${emailConfig.user}`,
            to,
            subject,
            html,
        });
    }
}

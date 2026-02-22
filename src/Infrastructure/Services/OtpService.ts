import { IOtpService } from '@application/Interfaces/Services/IOtpService';
import { injectable } from 'tsyringe';

@injectable()
export class OtpService implements IOtpService {
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

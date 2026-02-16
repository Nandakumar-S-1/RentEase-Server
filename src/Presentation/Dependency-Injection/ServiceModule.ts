import { IMailService } from '@application/Interfaces/User-Interfaces/IMailService ';
import { IOtpService } from '@application/Interfaces/User-Interfaces/IOtpService';
import { IRedisCache } from '@application/Interfaces/User-Interfaces/IRedisCacheService';
import { RedisCacheService } from '@infrastructure/Cache/RedisCache.service';
import { IHashService } from '@infrastructure/Interfaces/IHashService';
import { BcryptHashService } from '@infrastructure/Services/BcryptHashService ';
import { MailService } from '@infrastructure/Services/MailService';
import { OtpService } from '@infrastructure/Services/OtpService';

import { container } from 'tsyringe';

export class ServiceModule {
  static registerModues(): void {
    container.register<IHashService>('IHashService', {
      useClass: BcryptHashService,
    });
    container.register<IOtpService>("IOtpService",{
      useClass:OtpService
    });
    container.register<IMailService>('IMailService',{ //When someone asks for IMailService, create a new instance of MailService.
      useClass:MailService
    })
    container.register<IRedisCache>('IRedisCache',{
      useClass:RedisCacheService
    })
  }
}

import { IJwtService } from '@application/Interfaces/Services/IJwtService';
import { IMailService } from '@application/Interfaces/Services/IMailService ';
import { IOtpService } from '@application/Interfaces/Services/IOtpService';
import { IRedisCache } from '@application/Interfaces/Services/IRedisCacheService';
import { RedisCacheService } from '@infrastructure/Cache/RedisCache.service';
import { IHashService } from '@application/Interfaces/Services/IHashService';
import { BcryptHashService } from '@infrastructure/Services/BcryptHashService ';
import { JwtService } from '@infrastructure/Services/JwtService';
import { MailService } from '@infrastructure/Services/MailService';
import { OtpService } from '@infrastructure/Services/OtpService';

import { container } from 'tsyringe';

export class ServiceModule {
  static registerModues(): void {
    container.register<IHashService>('IHashService', {
      useClass: BcryptHashService,
    });
    container.register<IOtpService>('IOtpService', {
      useClass: OtpService,
    });
    container.register<IMailService>('IMailService', {
      //When someone asks for IMailService, create a new instance of MailService.
      useClass: MailService,
    });
    container.register<IRedisCache>('IRedisCache', {
      useClass: RedisCacheService,
    });
    container.register<IJwtService>('IJwtService',{
      useClass:JwtService,
    })
  }
}

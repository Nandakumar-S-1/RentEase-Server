import { IJwtService } from 'application/interfaces/services/jwt.service.interface';
import { IMailService } from 'application/interfaces/services/mail.service.interface';
import { IOtpService } from 'application/interfaces/services/otp.service.interface';
import { IRedisCache } from 'application/interfaces/services/redis-cache.service.interface';
import { RedisCacheService } from 'infrastructure/cache/redis-cache.service';
import { IHashService } from 'application/interfaces/services/hash.service.interface';
import { BcryptHashService } from 'infrastructure/services/bcrypt-hash.service';
import { JwtService } from 'infrastructure/services/jwt.service';
import { MailService } from 'infrastructure/services/mail.service';
import { OtpService } from 'infrastructure/services/otp.service';

import { container } from 'tsyringe';
import { TokenTypes } from 'shared/types/tokens';
import { IFirebaseService } from 'application/interfaces/services/firebase.service.interface';
import { FirebaseService } from 'infrastructure/services/firebase.service';

export class ServiceModule {
    static registerModules(): void {
        container.register<IHashService>(TokenTypes.IHashService, {
            useClass: BcryptHashService,
        });
        container.register<IOtpService>(TokenTypes.IOtpService, {
            useClass: OtpService,
        });
        container.register<IMailService>(TokenTypes.IMailService, {
            //When someone asks for IMailService, create a new instance of MailService.
            useClass: MailService,
        });
        container.register<IRedisCache>(TokenTypes.IRedisCache, {
            useClass: RedisCacheService,
        });
        container.register<IJwtService>(TokenTypes.IJwtService, {
            useClass: JwtService,
        });
        container.register<IFirebaseService>(TokenTypes.IFirebaseService, {
            useClass: FirebaseService,
        });
    }
}

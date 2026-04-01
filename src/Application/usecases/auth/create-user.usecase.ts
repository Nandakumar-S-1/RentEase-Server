import { ICreateUserDTO } from 'application/dtos/authentication/create-user-response.dto';
import { ICreateUserUseCase } from 'application/interfaces/auth/create-user.usecase.interface';
import { IMailService } from 'application/interfaces/services/mail.service.interface';
import { IOtpService } from 'application/interfaces/services/otp.service.interface';
import { IRedisCache } from 'application/interfaces/services/redis-cache.service.interface';
import { UserMapper } from 'application/mappers/auth/user.mapper';
import { UserEntity } from 'core/entities/user.entity';
import { IUserRepository } from 'core/interfaces/user-repository.interface';
import { IHashService } from 'application/interfaces/services/hash.service.interface';
import { logger } from 'shared/log/logger';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { PhoneAlreadyExistError, UserAlreadyExistError } from 'shared/errors/user-errors';

//this is where everything gets connected //@injectable() tells tsyringe "this class can be created by the main container
//this class represents a specific single operation.which is creating new user // Single Responsibility Principle

@injectable()
export class Create_User_Usecase implements ICreateUserUseCase {
    constructor(
        @inject(TokenTypes.IUserRepository) // "When creating this class, look up 'UserRepository' token  // and inject whatever class is registered for that token"
        private readonly _userRepository: IUserRepository, //this decorator will tell the tsyringe to inject the user repository  //Dependency Inversion Principle in action here because the type is an Interface insted of the class UserRepo //nothing but this usecase doesnt know itis using mongo,or postg or any otherdb . //it only know to call findby email in IUserRepository and create in Ibaserepo methods //insted of the usecase to create its own repo, it will receive the repo as parameter

        @inject(TokenTypes.IHashService)
        private readonly _hashService: IHashService,

        @inject(TokenTypes.IOtpService)
        private readonly _otpService: IOtpService,

        @inject(TokenTypes.IMailService)
        private readonly _mailService: IMailService,

        @inject(TokenTypes.IRedisCache)
        private readonly _redisCache: IRedisCache,
    ) {}

    async execute(dto: ICreateUserDTO): Promise<UserEntity> {
        //this is the logic to execute the usecase //this has no connection to express or rest or anything like that

        const isUserExist = await this._userRepository.findByEmail(dto.email);

        if (isUserExist) {
            throw new UserAlreadyExistError();
        }
        if (dto.phone) {
            const isPhoneExist = await this._userRepository.findByPhone(dto.phone);
            if (isPhoneExist) {
                throw new PhoneAlreadyExistError();
            }
        }

        const hashedPasswordIS = await this._hashService.hash(dto.password);
        const user = UserMapper.toEntity({
            ...dto,
            password: hashedPasswordIS,
        }); //Convert DTO to Entity using mapper, This adds UUID, prepares data for storage

        // Instead of saving to DB, we store the entity data in Redis until verification
        const otp = this._otpService.generateOTP();

        logger.info(`''''''''''''otp is'''''''''''''''''''${otp}`);

        // Store the raw user data in Redis for verification later
        const pendingUserData = {
            id: user.id,
            email: user.email,
            fullname: user.fullname,
            passwordHash: user.password,
            phone: user.phone,
            role: user.role,
            isEmailVerified: false,
            isActive: true,
            isSuspended: false,
            createdAt: new Date().toISOString(),
        };

        await this._redisCache.set(
            `pending_user:${user.email}`,
            JSON.stringify(pendingUserData),
            300,
        );
        await this._redisCache.set(`otp:${user.email}`, otp, 300);

        await this._mailService.sendMail(
            user.email,
            'verify your Email by typing the otp',
            `your OTP code is ${otp}`,
        );

        return user;
    }
}

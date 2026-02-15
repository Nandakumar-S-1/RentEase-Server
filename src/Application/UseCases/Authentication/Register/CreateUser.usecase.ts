import { ICreateUserDTO } from '@application/Data-Transfer-Object/Authentication/ICreateUserDTO';
import { ICreateUserUseCase } from '@application/Interfaces/User-Interfaces/ICreateUserUseCase';
import { UserMapper } from '@application/Mappers/Authentication/User.mapper';
import { UserEntity } from '@core/Entities/user.entity';
import { IUserRepository } from '@core/Interfaces/IUserRepository';
import { IHashService } from '@infrastructure/Interfaces/IHashService';
import { inject, injectable } from 'tsyringe';

//this is where everything gets connected //@injectable() tells tsyringe "this class can be created by the main container
 //this class represents a specific single operation.which is creating new user // Single Responsibility Principle


@injectable()
export class Create_User_Usecase implements ICreateUserUseCase {
   constructor(
    @inject('IUserRepository')     // "When creating this class, look up 'UserRepository' token  // and inject whatever class is registered for that token"
    private readonly userRepository: IUserRepository, //this decorator will tell the tsyringe to inject the user repository  //Dependency Inversion Principle in action here because the type is an Interface insted of the class UserRepo //nothing but this usecase doesnt know itis using mongo,or postg or any otherdb . //it only know to call findby email in IUserRepository and create in Ibaserepo methods //insted of the usecase to create its own repo, it will receive the repo as parameter
  
    @inject('IHashService')
    private readonly hashService:IHashService
  ) {}

  async execute(dto: ICreateUserDTO): Promise<UserEntity> {//this is the logic to execute the usecase //this has no connection to express or rest or anything like that
    
    const isUserExist = await this.userRepository.findByEmail(dto.email);

    if (isUserExist) {
      throw new Error('User alredy exists');
    }
    const hashedPasswordIS = await this.hashService.hash(dto.password)
    const user = UserMapper.toEntity({
      ...dto,password:hashedPasswordIS
    }); 
    //Convert DTO to Entity using mapper, This adds UUID, prepares data for storage
    return await this.userRepository.create(user);
  }
}

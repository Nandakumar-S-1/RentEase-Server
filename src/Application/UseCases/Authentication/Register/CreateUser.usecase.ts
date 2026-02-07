import { ICreateUserDTO } from '@application/Data-Transfer-Object/Authentication/ICreateUserDTO';
import { UserMapper } from '@application/Mappers/Authentication/User.mapper';
import { IUserRepository } from '@core/Interfaces/IUserRepository';
import { inject, injectable } from "tsyringe"

//this is where everything gets connected
@injectable()
export class Create_User_Usecase {
    //this class represents the a specific single operation.which is creating new user
    // Single Responsibility Principle

    constructor(
        @inject('UserRepository')
        //this decorator will tell the tsyringe to inject the user repository 
        //Dependency Inversion Principle in action here because the type is an Interface insted of the class UserRepo

        //nothing but this usecase doesnt know itis using mongo,or postg or any otherdb .
        //it only know to call findby email in IUserRepository and create in Ibaserepo methods

        private readonly userRepository: IUserRepository,
        //insted of the usecase to create its own repo, it will receive the repo as parameter
    ) { }
    async execute(dto: ICreateUserDTO) {
        //this is the logic to execute the usecase
        //this has no connection to express or rest or anything like that
        const isUserExist = await this.userRepository.findByEmail(dto.email)

        if (isUserExist) {
            throw new Error('User alredy exists')
        }
        const user = UserMapper.toEntity(dto)
        return await this.userRepository.create(user)
    }

}



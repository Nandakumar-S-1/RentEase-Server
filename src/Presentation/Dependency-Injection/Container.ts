import { container } from "tsyringe";

import { IUserRepository } from "@core/Interfaces/IUserRepository";
import { UserRepository } from "@infrastructure/Repositories/UserRepository";


container.register<IUserRepository>('UserRepository',{
    useClass:UserRepository
})

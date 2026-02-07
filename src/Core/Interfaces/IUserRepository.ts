import { UserEntity } from "Core/Entities/user.entity";
import { IBaseRepository } from 'Core/Interfaces/Base/IBaseRepository'

//reuse common repository operations while still extending user-specific queries,

//this is the dependency inversion principle, where we depend on the abstraction rather than its implementation
//ie , high-level modules eg:- the business logic, don't depend on low-level modules eg:-database code
//this is inheritence, where base repo is being extended to user repo
export interface IUserRepository extends IBaseRepository<UserEntity>{
  findByEmail(email: string): Promise<UserEntity | null>
}





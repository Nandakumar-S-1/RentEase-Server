import { UserEntity } from 'core/entities/user.entity';
import { IBaseRepository } from 'core/interfaces/base/base-repository.interface';

//reuse common repository operations while still extending user-specific queries,

//this is the dependency inversion principle, where we depend on the abstraction rather than its implementation
//ie , high-level modules eg:- the business logic, don't depend on low-level modules eg:-database code
//this is inheritence, where base repo is being extended to user repo

export interface IUserRepository extends IBaseRepository<UserEntity> {
    findByEmail(email: string): Promise<UserEntity | null>;
    findByPhone(phone: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    findAll(): Promise<UserEntity[]>;
    update(id: string, user: UserEntity): Promise<UserEntity>;
}

// here is also the liskov subst priciple comes. in a way that base repo is extended to user repo.
// so anywher we want t use base repo we can use userrepos

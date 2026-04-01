// All database-related classes are registered here. if you switch the db's,  only change THIS file:

import { container } from 'tsyringe';
import { IUserRepository } from 'core/interfaces/user-repository.interface';
import { UserRepository } from 'infrastructure/repositories/user-repository';
import { TokenTypes } from 'shared/types/tokens';
import { IOwnerProfileRepository } from 'core/interfaces/owner-repository.interface';
import { OwnerProfileRepository } from 'infrastructure/repositories/owner-profile.repository';
import { ITenantProfileRepository } from 'core/interfaces/tenant-repository.interface';
import { TenantProfileRepository } from 'infrastructure/repositories/tenant-profile.repository';

export class RepositoryModule {
    //this is like when a call for Iuserrepo token ,it will give an instance of UserRepository class
    // tsyringe wills stores: { "IUserRepository" token → UserRepository class }

    static registerModules(): void {
        container.register<IUserRepository>(TokenTypes.IUserRepository, {
            useClass: UserRepository,
        });
        container.register<IOwnerProfileRepository>(TokenTypes.IOwnerProfileRepository, {
            useClass: OwnerProfileRepository,
        });
        container.register<ITenantProfileRepository>(TokenTypes.ITenantProfileRepository, {
            useClass: TenantProfileRepository,
        });
    }
}

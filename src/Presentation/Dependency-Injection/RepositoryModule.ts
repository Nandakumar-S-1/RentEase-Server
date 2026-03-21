// All database-related classes are registered here. if you switch the db's,  only change THIS file:

import { container } from 'tsyringe';
import { IUserRepository } from '@core/Interfaces/IUserRepository';
import { UserRepository } from '@infrastructure/Repositories/UserRepository';
import { TokenTypes } from '@shared/Types/tokens';
import { IOwnerProfileRepository } from '@core/Interfaces/IOwnerRepository';
import { OwnerProfileRepository } from '@infrastructure/Repositories/OwnerProfile.repository';

export class RepositoryModule {
  //this is like when a call for Iuserrepo token ,it will give an instance of UserRepository class
  // tsyringe wills stores: { "IUserRepository" token → UserRepository class }

  static registerModules(): void {
    container.register<IUserRepository>(TokenTypes.IUserRepository, {
      useClass: UserRepository,
    });
    container.register<IOwnerProfileRepository>(TokenTypes.IOwnerProfileRepository,{
      useClass:OwnerProfileRepository
    })
  }
}

import { UserEntity } from 'Core/Entities/user.entity';
import { UserTypeData } from 'Core/Types/user.types';

//Database=> Domain(it actually convert database records into domain entities) // the database might have different names compared to domain.
//so we use this mapper to convert database records back to domain entities. database to entity used because db not equalto domains shape
export class UserPersistenceMapper {
  static toEntity(raw: any): UserEntity {
    return UserEntity.create({
      id: raw.id,
      email: raw.email,
      fullname: raw.fullName,
      passwordHash: raw.passwordhash,
      phone: raw.phone,
      role: raw.role,
      isActive: raw.isActive,
      isSuspended: raw.isSuspended,
      isEmailVerified: raw.isEmailVerified,
      createdAt: raw.createdAt,
    });
  }
}

// in short words this is the reverse dirrection of UserMapper in application layer.

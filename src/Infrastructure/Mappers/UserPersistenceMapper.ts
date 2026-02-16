import { User, UserRole as PrismaUSerRole } from '@prisma/client';
import { UserRole } from '@shared/Enums/user.role.type';
import { UserEntity } from 'Core/Entities/user.entity';

//Database=> Domain(it actually convert database records into domain entities) // the database might have different names compared to domain.
//so we use this mapper to convert database records back to domain entities. database to entity used because db not equalto domains shape
export class UserPersistenceMapper {
  static toEntity(raw: User): UserEntity {
    return UserEntity.create({
      id: raw.id,
      email: raw.email,
      fullname: raw.fullName,
      passwordHash: raw.passwordHash,
      phone: raw.phone,
      role: this.mapUserROle(raw.role),
      isActive: raw.isActive,
      isSuspended: raw.isSuspended,
      isEmailVerified: raw.isEmailVerified,
      createdAt: raw.createdAt,
    });
  }
  private static mapUserROle(role: PrismaUSerRole): UserRole {
    return role as unknown as UserRole;
  }
}

// in short words this is the reverse dirrection of UserMapper in application layer.

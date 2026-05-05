import { UserRole as PrismaUSerRole } from '@prisma/client';
import { UserRole } from 'shared/enums/user-role.enum';
import { UserEntity } from "../../core/entities/user.entity";

//Database=> Domain(it actually convert database records into domain entities) // the database might have different names compared to domain.
//so we use this mapper to convert database records back to domain entities. database to entity used because db not equalto domains shape
interface RawPrismaUser {
    id: string;
    email: string;
    fullName: string;
    passwordHash: string;
    phone: string | null;
    role: PrismaUSerRole;
    isActive: boolean;
    isSuspended: boolean;
    isEmailVerified: boolean;
    avatarUrl: string | null;
    createdAt: Date;
    owner_profile?: {
        verificationStatus: string;
    } | null;
}

export class UserPersistenceMapper {
    static toEntity(raw: RawPrismaUser): UserEntity {
        return UserEntity.create({
            id: raw.id,
            email: raw.email,
            fullname: raw.fullName,
            passwordHash: raw.passwordHash,
            phone: raw.phone,
            role: UserPersistenceMapper._mapUserROle(raw.role),
            isActive: raw.isActive,
            isSuspended: raw.isSuspended,
            isEmailVerified: raw.isEmailVerified,
            avatarUrl: raw.avatarUrl,
            verificationStatus: raw.owner_profile?.verificationStatus,
            createdAt: raw.createdAt,
        });
    }
    private static _mapUserROle(role: PrismaUSerRole): UserRole {
        const mapping: Record<PrismaUSerRole, UserRole> = {
            [PrismaUSerRole.ADMIN]: UserRole.ADMIN,
            [PrismaUSerRole.OWNER]: UserRole.OWNER,
            [PrismaUSerRole.TENANT]: UserRole.TENANT,
        };
        return mapping[role];
    }
}

// in short words this is the reverse dirrection of UserMapper in application layer.

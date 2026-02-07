import { UserEntity } from "Core/Entities/user.entity";
import { UserTypeData } from "Core/Types/user.types";

//Database=> Domain(it actually convert database records into domain entities)
export class UserPersistenceMapper{
    static toEntity(raw:any):UserEntity{
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
        })
    }
}
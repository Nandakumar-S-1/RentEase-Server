
import { prisma } from "@infrastructure/Database/prisma/prisma.client";
import { UserPersistenceMapper } from "@infrastructure/Mappers/UserPersistenceMapper";
import { UserEntity } from "Core/Entities/user.entity";
import { IUserRepository } from "Core/Interfaces/IUserRepository";
import { BaseRepository } from "./Base/BaseRepository";


//poly 
export class UserRepository extends BaseRepository<UserEntity ,typeof prisma.user> implements  IUserRepository{
    constructor(){
        super(prisma.user,{
            toEntity:UserPersistenceMapper.toEntity,
            toPrismaCreate:(entity:UserEntity)=>({
                id:entity.id,
                email:entity.email,
                phone:entity.phone,
                passwordHash:entity.password,
                fullName:entity.fullname,
                role:entity.role
            })
        })
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user=await prisma.user.findUnique({
            where:{email}
        })
        return user ? UserPersistenceMapper.toEntity(user):null
    }
    


}



// async create(user: UserEntity): Promise<UserEntity> {
    //     const result = await prisma.user.create({
    //         data:{
    //             id:user.id,
    //             email:user.email,
    //             phone:user.phone,
    //             role:user.role,
    //             passwordhash:user.password,
    //             fullName:user.fullname,
    //         }   
    //     })
    //     return UserPersistenceMapper.toEntity(result)
    // }
import { ICreateUserDTO } from "@application/Data-Transfer-Object/Authentication/ICreateUserDTO";
import { UserEntity } from "Core/Entities/user.entity";

//Incoming => Domain(like Convering external input into valid domain entity)

// The static keyword means itis  called  as UserMapper.toEntity(dto) without creating a UserMapper instance 

//this mapper is where the changes like adding uuid, password hashing , email changes etc are done.

//also this is like single responsibility principle where this mapper is responsible for converting dto to entity.

export class UserMapper {
    static toEntity(dto: ICreateUserDTO): UserEntity {
        return UserEntity.create({
            id: crypto.randomUUID(),
            email: dto.email,
            fullname: dto.fullname,
            passwordHash: dto.password,
            phone: dto.phone,
            role: dto.role,
        })
    }
}



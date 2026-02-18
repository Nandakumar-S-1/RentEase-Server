import { prisma } from '@infrastructure/Database/prisma/prisma.client';
//mapper to convert DB records ot Domain entities
import { UserPersistenceMapper } from '@infrastructure/Mappers/UserPersistenceMapper';
import { UserEntity } from 'Core/Entities/user.entity';
import { IUserRepository } from 'Core/Interfaces/IUserRepository';

//poly
// This is where Prisma connects to PostgreSQL. // UserRepository promises to fulfill the IUserRepository contract
export class UserRepository implements IUserRepository {
  //the repo receives the domain object user entitiy here and convert it to a prisma format  //Implement create() from IBaseRepository (via IUserRepository inheritance)
  async create(user: UserEntity): Promise<UserEntity> {
    const result = await prisma.user.create({
      //Use Prisma to insert into PostgreSQL
      data: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        passwordHash: user.password,
        fullName: user.fullname,
      },
    });
    return UserPersistenceMapper.toEntity(result);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    // iff found, map to entity; if not, return null
    return user ? UserPersistenceMapper.toEntity(user) : null;
  }
  async findByPhone(phone: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where:{phone},
    })
    return user ? UserPersistenceMapper.toEntity(user) : null
  }
  update(id: string, user: UserEntity): Promise<UserEntity> {
    try {
      const res = await prisma.user.update({
        where:{id},
        data:{
          email:user.email,
          phone:user.phone,
          fullName:user.fullname,
          isEmailVerified:user.isEmailVerified,
          isActive:user.isActive,
          isSuspended:user.isSuspended
        }
      })

      return UserPersistenceMapper.toEntity(res)
    } catch (error) {
      
    }
  }
}

import { prisma } from 'infrastructure/database/prisma/prisma.client';
//mapper to convert DB records ot Domain entities
import { UserPersistenceMapper } from 'infrastructure/mappers/user-persistence.mapper';
import { logger } from 'shared/log/logger';
import { UserEntity } from 'core/entities/user.entity';
import { IUserRepository } from 'core/interfaces/user-repository.interface';

//poly
//this is where the single responsibility principle workd
//because this class handle only the database operaiton for the user enitty
// This is where Prisma connects to PostgreSQL. // UserRepository promises to fulfill the IUserRepository contract
export class UserRepository implements IUserRepository {
    //the repo receives the domain object user entitiy here and convert it to a prisma format  //Implement create() from IBaseRepository (via IUserRepository inheritance)
    async create(user: UserEntity): Promise<UserEntity> {
        const result = await prisma.user.create({
            //Use Prisma to insert into PostgreSQL
            data: {
                id: user.id,
                email: user.email,
                phone: user.phone ?? undefined,
                role: user.role,
                passwordHash: user.password,
                fullName: user.fullname,
                isEmailVerified: user.isEmailVerified,
                isActive: user.isActive,
                isSuspended: user.isSuspended,
            },
        });
        return UserPersistenceMapper.toEntity(result);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        // iff found, map to entity, if not- return null
        return user ? UserPersistenceMapper.toEntity(user) : null;
    }

    async findByPhone(phone: string): Promise<UserEntity | null> {
        const user = await prisma.user.findUnique({
            where: { phone },
        });
        return user ? UserPersistenceMapper.toEntity(user) : null;
    }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user ? UserPersistenceMapper.toEntity(user) : null;
    }

    async findAll(): Promise<UserEntity[]> {
        const users = await prisma.user.findMany();
        return users.map((user) => UserPersistenceMapper.toEntity(user));
    }

    async update(id: string, user: UserEntity): Promise<UserEntity> {
        try {
            const res = await prisma.user.update({
                where: { id },
                data: {
                    email: user.email,
                    phone: user.phone ?? undefined,
                    fullName: user.fullname,
                    isEmailVerified: user.isEmailVerified,
                    isActive: user.isActive,
                    isSuspended: user.isSuspended,
                    passwordHash: user.password,
                },
            });

            return UserPersistenceMapper.toEntity(res);
        } catch (error) {
            logger.error({ error }, `Error updating user with ID: ${id}`);
            throw new Error('Failed to update user');
        }
    }
}

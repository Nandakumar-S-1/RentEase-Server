import { IBaseRepository } from 'core/interfaces/base/base-repository.interface';
// import { prisma } from '@infrastructure/Database/prisma/prisma.client';

export abstract class BaseRepository<
    TEntity,
    TPersisted,
    TCreateInput,
    TUpdateInput,
    TModel extends {
        create: (param: { data: TCreateInput }) => Promise<TPersisted>;
        findUnique: (param: { where: { id: string } }) => Promise<TPersisted | null>;
        update: (param: { where: { id: string }; data: TUpdateInput }) => Promise<TPersisted>;
    },
> implements IBaseRepository<TEntity, TEntity> {
    constructor(
        protected readonly model: TModel,
        protected readonly mapper: {
            toEntity: (raw: TPersisted) => TEntity;
            toPrismaCreate: (entity: TEntity) => TCreateInput;
            toPrismaUpdate: (entity: Partial<TEntity>) => TUpdateInput;
        },
    ) {}

    async create(entity: TEntity): Promise<TEntity> {
        const data = this.mapper.toPrismaCreate(entity);
        const res = await this.model.create({ data });
        return this.mapper.toEntity(res);
    }

    async findById(id: string): Promise<TEntity | null> {
        const res = await this.model.findUnique({ where: { id } });
        return res ? this.mapper.toEntity(res) : null;
    }

    async update(id: string, entity: Partial<TEntity>): Promise<TEntity> {
        const data = this.mapper.toPrismaUpdate(entity);
        const res = await this.model.update({ where: { id }, data });
        return this.mapper.toEntity(res);
    }
}

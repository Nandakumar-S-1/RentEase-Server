import { IBaseRepository } from '@core/Interfaces/Base/IBaseRepository';
// import { prisma } from '@infrastructure/Database/prisma/prisma.client';

export abstract class BaseRepository<
  TEntity,
  TPersisted,
  TCreateInput,
  TModel extends {
    create: (param: { data: TCreateInput }) => Promise<TPersisted>;
  },
> implements IBaseRepository<TEntity> {
  constructor(
    protected readonly model: TModel,
    protected readonly mapper: {
      toEntity: (raw: TPersisted) => TEntity;
      toPrismaCreate: (entity: TEntity) => TCreateInput;
    },
  ) {}

  async create(entity: TEntity): Promise<TEntity> {
    const data = this.mapper.toPrismaCreate(entity);
    const res = await this.model.create({ data });
    return this.mapper.toEntity(res);
  }
}

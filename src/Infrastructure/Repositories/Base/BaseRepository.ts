import { IBaseRepository } from '@core/Interfaces/Base/IBaseRepository';
import { prisma } from '@infrastructure/Database/prisma/prisma.client';

export abstract class BaseRepository<
  TE,
  TM extends {
    create: (param: any) => Promise<any>;
  },
> implements IBaseRepository<TE> {
  constructor(
    protected readonly model: TM,
    protected readonly mapper: {
      toEntity: (raw: any) => TE;
      toPrismaCreate: (entity: TE) => any;
    },
  ) {}

  async create(entity: TE): Promise<TE> {
    const data = this.mapper.toPrismaCreate(entity);
    const res = await this.model.create({ data });
    return this.mapper.toEntity(res);
  }
}

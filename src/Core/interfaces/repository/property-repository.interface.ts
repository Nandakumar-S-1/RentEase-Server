import { PropertyEntity } from '@core/entities/property.entity';
import { GetAllPropertiesDTO } from '@application/interfaces/property/property.usecase.interface';
import { IBaseRepository } from '../base/base-repository.interface';
import { QueryOptions } from '../base/query-options.interface';

export interface IPropertyRepository extends IBaseRepository<PropertyEntity, PropertyEntity, (entity: PropertyEntity) => Promise<PropertyEntity>> {
    findById(id: string): Promise<PropertyEntity | null>;
    findByOwnerId(
        ownerId: string,
        options?: QueryOptions,
    ): Promise<PropertyEntity[]>;
    countByOwnerId(ownerId: string, status?: string): Promise<number>;
    update(entity: PropertyEntity): Promise<PropertyEntity>;
    unlist(id: string): Promise<void>;
    delete(id: string): Promise<void>;
    relist(id: string): Promise<void>;
    incrementViews(id: string): Promise<void>;
    findPending(options?: Omit<QueryOptions, 'status'>): Promise<PropertyEntity[]>;
    findAll(
        options?: QueryOptions,
        filters?: Partial<GetAllPropertiesDTO>,
    ): Promise<PropertyEntity[]>;
    countAll(status?: string, filters?: Partial<GetAllPropertiesDTO>): Promise<number>;
}

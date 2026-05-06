import { PropertyEntity } from '@core/entities/property.entity';
import { GetAllPropertiesDTO } from '@application/interfaces/property/property.usecase.interface';
import { IBaseRepository } from '../base/base-repository.interface';

export interface IPropertyRepository extends IBaseRepository<PropertyEntity> {
    findById(id: string): Promise<PropertyEntity | null>;
    findByOwnerId(
        ownerId: string,
        status?: string,
        skip?: number,
        take?: number,
    ): Promise<PropertyEntity[]>;
    countByOwnerId(ownerId: string, status?: string): Promise<number>;
    update(entity: PropertyEntity): Promise<PropertyEntity>;
    unlist(id: string): Promise<void>;
    delete(id: string): Promise<void>;
    relist(id: string): Promise<void>;
    incrementViews(id: string): Promise<void>;
    // search(filters:any):Promise<PropertyEntity[]>
    findPending(skip?: number, take?: number): Promise<PropertyEntity[]>;
    findAll(
        status?: string,
        skip?: number,
        take?: number,
        filters?: Partial<GetAllPropertiesDTO>,
    ): Promise<PropertyEntity[]>;
    countAll(status?: string, filters?: Partial<GetAllPropertiesDTO>): Promise<number>;
}

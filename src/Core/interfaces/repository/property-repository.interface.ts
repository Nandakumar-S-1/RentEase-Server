import { PropertyEntity } from '@core/entities/property.entity';
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
    // search(filters:any):Promise<PropertyEntity[]>
    findPending(): Promise<PropertyEntity[]>;
}

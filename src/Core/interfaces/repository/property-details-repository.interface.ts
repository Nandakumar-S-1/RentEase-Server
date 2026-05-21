import { PropertyDetailsEntity } from '@core/entities/property-details.entity';
import { IBaseRepository } from '../base/base-repository.interface';

export interface IPropertyDetailsRepository extends IBaseRepository<PropertyDetailsEntity, PropertyDetailsEntity, (entity: PropertyDetailsEntity) => Promise<PropertyDetailsEntity>> {
    findById(id: string): Promise<PropertyDetailsEntity | null>;
    update(entity: PropertyDetailsEntity): Promise<PropertyDetailsEntity>;
    findByPropertyId(propertyId: string): Promise<PropertyDetailsEntity | null>;
}

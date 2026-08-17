import { AmenityEntity } from '@core/entities/amenity.entity';

export interface IAmenityRepository {
    create(entity: AmenityEntity): Promise<AmenityEntity>;
    update(entity: AmenityEntity): Promise<AmenityEntity>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<AmenityEntity | null>;
    findAll(): Promise<AmenityEntity[]>;
}

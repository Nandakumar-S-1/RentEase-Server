import { CreateAmenityDTO, UpdateAmenityDTO } from '@application/dtos/amenity/amenity.dto';
import { AmenityEntity } from '@core/entities/amenity.entity';

export interface ICreateAmenityUseCase {
    execute(dto: CreateAmenityDTO): Promise<AmenityEntity>;
}
export interface IUpdateAmenityUseCase {
    execute(id: string, dto: UpdateAmenityDTO): Promise<AmenityEntity>;
}
export interface IDeleteAmenityUseCase {
    execute(id: string): Promise<void>;
}
export interface IGetAmenitiesUseCase {
    execute(): Promise<AmenityEntity[]>;
}

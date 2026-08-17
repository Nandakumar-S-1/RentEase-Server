import { ICreateAmenityUseCase, IUpdateAmenityUseCase, IDeleteAmenityUseCase, IGetAmenitiesUseCase } from '@application/interfaces/amenity/amenity.usecase.interface';
import { IAmenityRepository } from '@core/interfaces/repository/amenity-repository.interface';
import { CreateAmenityDTO, UpdateAmenityDTO } from '@application/dtos/amenity/amenity.dto';
import { AmenityEntity } from '@core/entities/amenity.entity';
import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';


@injectable()
export class CreateAmenityUseCase implements ICreateAmenityUseCase {
    constructor(@inject(TokenTypes.IAmenityRepository) private repo: IAmenityRepository) {}
    async execute(dto: CreateAmenityDTO): Promise<AmenityEntity> {
        const id = crypto.randomUUID();
        const entity = AmenityEntity.create({ id, ...dto });
        return this.repo.create(entity);
    }
}

@injectable()
export class UpdateAmenityUseCase implements IUpdateAmenityUseCase {
    constructor(@inject(TokenTypes.IAmenityRepository) private repo: IAmenityRepository) {}
    async execute(id: string, dto: UpdateAmenityDTO): Promise<AmenityEntity> {
        const existing = await this.repo.findById(id);
        if (!existing) throw new Error('Amenity not found');
        const entity = AmenityEntity.create({ ...existing, ...dto, updatedAt: new Date() });
        return this.repo.update(entity);
    }
}

@injectable()
export class DeleteAmenityUseCase implements IDeleteAmenityUseCase {
    constructor(@inject(TokenTypes.IAmenityRepository) private repo: IAmenityRepository) {}
    async execute(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}

@injectable()
export class GetAmenitiesUseCase implements IGetAmenitiesUseCase {
    constructor(@inject(TokenTypes.IAmenityRepository) private repo: IAmenityRepository) {}
    async execute(): Promise<AmenityEntity[]> {
        return this.repo.findAll();
    }
}

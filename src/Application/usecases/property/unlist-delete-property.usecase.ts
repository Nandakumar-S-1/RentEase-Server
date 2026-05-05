import {
    IUnlistPropertyUseCase,
    IDeletePropertyUseCase,
    IRelistPropertyUseCase,
} from '@application/interfaces/property/property.usecase.interface';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { PropertyNotFoundError } from '@shared/errors/property-errors';
import { BadRequestError } from '@shared/errors/common-errors';
import { PropertyStatus } from '@shared/enums/property-type-status.enum';

@injectable()
export class UnlistPropertyUseCase implements IUnlistPropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const property = await this._propertyRepo.findById(id);
        if (!property) throw new PropertyNotFoundError();

        if (property.status !== PropertyStatus.ACTIVE) {
            throw new BadRequestError('Only active properties can be unlisted');
        }

        await this._propertyRepo.unlist(id);
    }
}

@injectable()
export class DeletePropertyUseCase implements IDeletePropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) { }

    async execute(id: string): Promise<void> {
        await this._propertyRepo.delete(id);
    }
}

@injectable()
export class RelistPropertyUseCase implements IRelistPropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const property = await this._propertyRepo.findById(id);
        if (!property) throw new PropertyNotFoundError();

        if (property.status !== PropertyStatus.UNLISTED) {
            throw new BadRequestError('Only unlisted properties can be relisted');
        }

        await this._propertyRepo.relist(id);
    }
}

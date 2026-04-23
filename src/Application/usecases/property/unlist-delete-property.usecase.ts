import {
    IUnlistPropertyUseCase,
    IDeletePropertyUseCase,
    IRelistPropertyUseCase,
} from '@application/interfaces/property/property.usecase.interface';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UnlistPropertyUseCase implements IUnlistPropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) { }

    async execute(id: string): Promise<void> {
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
        await this._propertyRepo.relist(id);
    }
}

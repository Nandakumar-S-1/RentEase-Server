import { OwnerRequestEntity } from '@core/entities/owner-request.entity';

export interface IOwnerRequestRepository {
    create(entity: OwnerRequestEntity): Promise<OwnerRequestEntity>;
    update(entity: OwnerRequestEntity): Promise<OwnerRequestEntity>;
    findById(id: string): Promise<OwnerRequestEntity | null>;
    findAll(): Promise<OwnerRequestEntity[]>;
    findByOwnerId(ownerId: string): Promise<OwnerRequestEntity[]>;
}

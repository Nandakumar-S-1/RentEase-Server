import { TenantProfileTypeData } from 'core/types/tenantProfile.types';

export class TenantProfileEntity {
    private constructor(
        private readonly _id: string,
        private readonly _userId: string,
        private _bio: string | null,
        private _occupation: string | null,
        private readonly _createdAt: Date,
        private readonly _updatedAt: Date,
    ) {}

    static create(data: TenantProfileTypeData): TenantProfileEntity {
        return new TenantProfileEntity(
            data.id,
            data.userId,
            data.bio ?? null,
            data.occupation ?? null,
            data.createdAt ?? new Date(),
            data.updatedAt ?? new Date(),
        );
    }

    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
    }
    get bio() {
        return this._bio;
    }
    get occupation() {
        return this._occupation;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }

    updateBio(bio: string | null): void {
        this._bio = bio;
    }
    updateOccupation(occupation: string | null): void {
        this._occupation = occupation;
    }
}

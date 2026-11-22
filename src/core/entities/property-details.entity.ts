import { PropertyDetailsTypeData } from '@core/types/PropertyDetailsTypeData';

export class PropertyDetailsEntity {
    private constructor(
        private readonly _id: string,
        private readonly _propertyId: string,

        private _specificDetails: Record<string, any> | null,

        private _preferredTenantType: string[] | null,
        private _petsAllowed: boolean | null,
        private _smokingAllowed: boolean | null,
        private _maximumOccupants: number | null,
        private _amenities: any[],

        private readonly _createdAt: Date,
        private _updatedAt: Date,
    ) {}

    static create(data: PropertyDetailsTypeData): PropertyDetailsEntity {
        return new PropertyDetailsEntity(
            data.id,
            data.propertyId,
            data.specificDetails ?? null,
            data.preferredTenantType ?? null,
            data.petsAllowed ?? false,
            data.smokingAllowed ?? false,
            data.maximumOccupants ?? null,
            data.amenities ?? [],
            data.createdAt ?? new Date(),
            data.updatedAt ?? new Date(),
        );
    }

    get id() {
        return this._id;
    }
    get propertyId() {
        return this._propertyId;
    }
    get specificDetails() {
        return this._specificDetails;
    }
    get preferredTenantType() {
        return this._preferredTenantType;
    }
    get petsAllowed() {
        return this._petsAllowed;
    }
    get smokingAllowed() {
        return this._smokingAllowed;
    }
    get maximumOccupants() {
        return this._maximumOccupants;
    }
    get amenities() {
        return this._amenities;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }

    update(data: Partial<PropertyDetailsTypeData>): void {
        if (data.specificDetails !== undefined) this._specificDetails = data.specificDetails;
        if (data.preferredTenantType !== undefined)
            this._preferredTenantType = data.preferredTenantType;
        if (data.petsAllowed !== undefined) this._petsAllowed = data.petsAllowed;
        if (data.smokingAllowed !== undefined) this._smokingAllowed = data.smokingAllowed;
        if (data.maximumOccupants !== undefined) this._maximumOccupants = data.maximumOccupants;
        if (data.amenities !== undefined) this._amenities = data.amenities;

        this._updatedAt = new Date();
    }
}

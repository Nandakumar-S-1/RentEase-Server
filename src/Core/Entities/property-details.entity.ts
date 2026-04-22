import { PropertyDetailsTypeData } from '@core/types/PropertyDetailsTypeData';

export class PropertyDetailsEntity {
    private constructor(
        private readonly _id: string,
        private readonly _propertyId: string,

        // common attributes
        private _bhk: number | null,
        private _bathrooms: number | null,
        private _floorNumber: string | null,
        private _totalFloors: number | null,
        private _propertyAge: string | null,
        private _facingDirection: string | null,
        private _furnishingStatus: string | null,

        // land attributes
        private _landType: string | null,
        private _isCornerPlot: boolean | null,

        // shop attributes
        private _shopType: string | null,
        private _hasParkingArea: boolean | null,

        private _preferredTenantType: string[] | null,
        private _amenities: string[],

        private readonly _createdAt: Date,
        private _updatedAt: Date,
    ) {}

    static create(data: PropertyDetailsTypeData): PropertyDetailsEntity {
        return new PropertyDetailsEntity(
            data.id,
            data.propertyId,
            data.bhk ?? null,
            data.bathrooms ?? null,
            data.floorNumber ?? null,
            data.totalFloors ?? null,
            data.propertyAge ?? null,
            data.facingDirection ?? null,
            data.furnishingStatus ?? null,
            data.landType ?? null,
            data.isCornerPlot ?? null,
            data.shopType ?? null,
            data.hasParking ?? null,
            data.preferredTenantType ?? null,
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
    get bhk() {
        return this._bhk;
    }
    get bathrooms() {
        return this._bathrooms;
    }
    get floorNumber() {
        return this._floorNumber;
    }
    get totalFloors() {
        return this._totalFloors;
    }
    get propertyAge() {
        return this._propertyAge;
    }
    get facingDirection() {
        return this._facingDirection;
    }
    get furnishingStatus() {
        return this._furnishingStatus;
    }
    get landType() {
        return this._landType;
    }
    get isCornerPlot() {
        return this._isCornerPlot;
    }
    get shopType() {
        return this._shopType;
    }
    get hasParking() {
        return this._hasParkingArea;
    }
    get preferredTenantType() {
        return this._preferredTenantType;
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
        if (data.bhk !== undefined) this._bhk = data.bhk;
        if (data.bathrooms !== undefined) this._bathrooms = data.bathrooms;
        if (data.floorNumber !== undefined) this._floorNumber = data.floorNumber;
        if (data.totalFloors !== undefined) this._totalFloors = data.totalFloors;
        if (data.propertyAge !== undefined) this._propertyAge = data.propertyAge;
        if (data.facingDirection !== undefined) this._facingDirection = data.facingDirection;
        if (data.furnishingStatus !== undefined) this._furnishingStatus = data.furnishingStatus;
        if (data.landType !== undefined) this._landType = data.landType;
        if (data.isCornerPlot !== undefined) this._isCornerPlot = data.isCornerPlot;
        if (data.shopType !== undefined) this._shopType = data.shopType;
        if (data.hasParking !== undefined) this._hasParkingArea = data.hasParking;
        if (data.preferredTenantType !== undefined)
            this._preferredTenantType = data.preferredTenantType;
        if (data.amenities !== undefined) this._amenities = data.amenities;

        this._updatedAt = new Date();
    }
}

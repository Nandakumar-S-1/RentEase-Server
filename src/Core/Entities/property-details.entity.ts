import { PropertyDetailsTypeData } from '@core/types/PropertyDetailsTypeData';

export class PropertyDetailsEntity {
    private constructor(
        private readonly _id: string,
        private readonly _propertyId: string,

        //flat ,house
        private _bhk: number | null,
        private _bathrooms: number | null,
        private _floorNumber: string | null,
        private _totalFloors: number | null,
        private _furnishingStatus: string | null,

        //land
        private _landType: string | null,
        private _isCornerPlot: boolean | null,

        //shop
        private _shopType: string | null,
        private _hasParkingArea: boolean | null,

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
            data.furnishingStatus ?? null,
            data.landType ?? null,
            data.isCornerPlot ?? null,
            data.shopType ?? null,
            data.hasParking ?? null,
            data.createdAt ?? new Date(),
            data.updatedAt ?? new Date(),
        );
    }
    get propertyId() {
        return this._propertyId;
    }
}

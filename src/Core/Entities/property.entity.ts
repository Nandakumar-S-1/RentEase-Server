import { PropertyTypeData } from '@core/types/property.types';
import { PropertyDetailsEntity } from '@core/entities/property-details.entity';
import { PropertyStatus, PropertyType } from '@shared/enums/property-type-status.enum';

export class PropertyEntity {
    private constructor(
        private readonly _id: string,
        private readonly _ownerId: string,
        private _title: string,
        private _description: string,
        private readonly _propertyType: PropertyType,
        private _areaSqft: number | null,
        private _locationDistrict: string,
        private _locationCity: string,
        private _locationPincode: string,
        private _fullAddress: string,

        private _latitude: number | null,
        private _longitude: number | null,
        private _nearbyLandMarks: string | null,

        private _monthlyRent: number,
        private _depositAmount: number,
        private _maintenanceCharges: number,
        private _maintenanceIncluded: boolean,

        private _photos: string[],
        private _primaryPhotoIndex: number,
        private _videoTourUrl: string | null,

        private _status: PropertyStatus,
        private _isFeatured: boolean,
        private _availableFrom: Date | null,

        private _viewsCount: number,
        private _inquiryCount: number,
        private _wishlistCount: number,

        private _approvedBy: string | null,
        private _approvedAt: Date | null,

        private readonly _createdAt: Date,
        private _updatedAt: Date,

        private _details?: PropertyDetailsEntity,
    ) {}

    static create(data: PropertyTypeData): PropertyEntity {
        let detailsEntity: PropertyDetailsEntity | undefined;
        if (data.details) {
            detailsEntity = PropertyDetailsEntity.create(data.details);
        }

        return new PropertyEntity(
            data.id,
            data.ownerId,
            data.title,
            data.description,
            data.propertyType,
            data.areaSqft ?? null,
            data.locationDistrict,
            data.locationCity,
            data.locationPincode,
            data.fullAddress,

            data.latitude ?? null,
            data.longitude ?? null,
            data.nearbyLandmarks ?? null,

            data.monthlyRent,
            data.depositAmount,
            data.maintenanceCharges ?? 0,
            data.maintenanceIncluded ?? true,

            data.photos ?? [],
            data.primaryPhotoIndex ?? 0,
            data.videoTourUrl ?? null,

            data.status ?? PropertyStatus.PENDING_APPROVAL,
            data.isFeatured ?? false,
            data.availableFrom ?? null,

            data.viewsCount ?? 0,
            data.inquiryCount ?? 0,
            data.wishlistCount ?? 0,

            data.approvedBy ?? null,
            data.approvedAt ?? null,

            data.createdAt ?? new Date(),
            data.updatedAt ?? new Date(),

            detailsEntity,
        );
    }

    get id() {
        return this._id;
    }
    get ownerId() {
        return this._ownerId;
    }
    get status() {
        return this._status;
    }
    get photos() {
        return this._photos;
    }
    get title() {
        return this._title;
    }
    get description() {
        return this._description;
    }
    get propertyType() {
        return this._propertyType;
    }
    get locationDistrict() {
        return this._locationDistrict;
    }
    get locationCity() {
        return this._locationCity;
    }
    get locationPincode() {
        return this._locationPincode;
    }
    get fullAddress() {
        return this._fullAddress;
    }
    get monthlyRent() {
        return this._monthlyRent;
    }
    get depositAmount() {
        return this._depositAmount;
    }
    get maintenanceCharges() {
        return this._maintenanceCharges;
    }
    get maintenanceIncluded() {
        return this._maintenanceIncluded;
    }
    get primaryPhotoIndex() {
        return this._primaryPhotoIndex;
    }
    get videoToursUrl() {
        return this._videoTourUrl;
    }
    get approvedBy() {
        return this._approvedBy;
    }
    get approvedAt() {
        return this._approvedAt;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    get areaSqft() {
        return this._areaSqft;
    }
    get viewsCount() {
        return this._viewsCount;
    }
    get latitude() {
        return this._latitude;
    }
    get longitude() {
        return this._longitude;
    }
    get nearbyLandmarks() {
        return this._nearbyLandMarks;
    }

    approve(adminId: string): void {
        this._status = PropertyStatus.APPROVED;
        this._approvedBy = adminId;
        this._approvedAt = new Date();
    }

    reject(): void {
        this._status = PropertyStatus.REJECTED;
    }

    unlist(): void {
        this._status = PropertyStatus.UNLISTED;
    }

    incrementViewsCount(): void {
        this._viewsCount++;
    }

    update(data: Partial<PropertyTypeData>): void {
        if (data.title) this._title = data.title;
        if (data.description) this._description = data.description;
        if (data.areaSqft !== undefined) this._areaSqft = data.areaSqft;
        if (data.locationDistrict) this._locationDistrict = data.locationDistrict;
        if (data.locationCity) this._locationCity = data.locationCity;
        if (data.locationPincode) this._locationPincode = data.locationPincode;
        if (data.fullAddress) this._fullAddress = data.fullAddress;
        if (data.monthlyRent !== undefined) this._monthlyRent = data.monthlyRent;
        if (data.depositAmount !== undefined) this._depositAmount = data.depositAmount;
        if (data.maintenanceCharges !== undefined)
            this._maintenanceCharges = data.maintenanceCharges;
        if (data.maintenanceIncluded !== undefined)
            this._maintenanceIncluded = data.maintenanceIncluded;
        if (data.photos) this._photos = data.photos;
        if (data.primaryPhotoIndex !== undefined) this._primaryPhotoIndex = data.primaryPhotoIndex;
        if (data.nearbyLandmarks !== undefined) this._nearbyLandMarks = data.nearbyLandmarks;
        if (data.latitude !== undefined) this._latitude = data.latitude;
        if (data.longitude !== undefined) this._longitude = data.longitude;

        if (data.details && this._details) {
            this._details.update(data.details);
        }

        this._updatedAt = new Date();
    }

    get details() {
        return this._details;
    }

    setDetails(details: PropertyDetailsEntity) {
        this._details = details;
    }
}

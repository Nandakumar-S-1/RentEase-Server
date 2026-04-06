import { PropertyTypeData } from "@core/types/property.types";
import { PropertyStatus, PropertyType } from "@shared/enums/property-type-status.enum";

export class PropertyEntity{
    private constructor(
        private readonly _id:string,
        private readonly _ownerId:string,
        private  _title:string,
        private   _description:string,
        private readonly _propertyType:PropertyType,
        private _areaSqft:number|null,
        private _locationDistrict:string,
        private _locationCity:string,
        private _locationPincode:string,
        private _fullAddress:string,

        private _latitude:number|null,
        private _longitude:number|null,
        private _nearbyLandMarks:string|null,

        private _monthlyRent:number,
        private _depositAmount:number,
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
    ){}

    static create(data:PropertyTypeData):PropertyEntity{
        return new PropertyEntity(
            data.id,
            data.ownerId,
            data.title,
            data.description,
            data.propertyType,
            data.areaSqft??null,
            data.locationDistrict,
            data.locationCity,
            data.locationPincode,
            data.fullAddress,

            data.latitude??null,
            data.longitude??null,
            data.nearbyLandmarks??null,

            data.monthlyRent,
            data.depositAmount,
            data.maintenanceCharges ??0,
            data.maintenanceIncluded ??true,

            data.photos ?? [],
            data.primaryPhotoIndex??0,
            data.videoTourUrl ??null,

            data.status ?? PropertyStatus.PENDING_APPROVAL,
            data.isFeatured??false,
            data.availableFrom??null,

            data.viewsCount ??0,
            data.inquiryCount ?? 0,
            data.wishlistCount ?? 0,

            data.approvedBy ?? null,
            data.aprovedAt ??new Date(),

            data.createdAt ?? new Date(),
            data.updatedAt ?? new Date(),
        )
    }

    get id(){
        return this._id
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

    approve(adminId:string):void{
        if(this._status !==PropertyStatus.PENDING_APPROVAL){
            throw new Error('Property not in approvable state')
        }
        this._status = PropertyStatus.ACTIVE
        this._approvedBy=adminId
        this._approvedAt=new Date()
    }

    reject():void{
        if(this._status !==PropertyStatus.PENDING_APPROVAL){
            throw new Error('Property not in rejectable state');
        }
        this._status = PropertyStatus.REJECTED
    }
    unlist():void{
        this._status=PropertyStatus.UNLISTED
    }
    incrementViewsCount():void{
        this._viewsCount++
    }
    updateDetails(title:string,description:string):void{
        if (!title || !description) {
            throw new Error('Invalid property details');
        }
        this._title =title;
        this._description=description;
        this._updatedAt=new Date()
    }

}
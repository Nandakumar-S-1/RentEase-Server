import { PropertyStatus, PropertyType } from "@shared/enums/property-type-status.enum";

export type PropertyTypeData ={
    id:string;
    ownerId:string,
    title:string,
    description:string
    propertyType:PropertyType

    areaSqft?:number
    locationDistrict:string
    locationCity:string
    locationPincode:string,
    fullAddress:string

    latitude?:number
    longitude?:number
    nearbyLandmarks?:string

    monthlyRent:number
    depositAmount:number
    maintenanceCharges?:number
    maintenanceIncluded?:boolean

    photos?:string[]
    primaryPhotoIndex?:number
    videoTourUrl?:string

    status?:PropertyStatus
    isFeatured?:boolean
    availableFrom?:Date

    viewsCount?:number
    inquiryCount?:number
    wishlistCount?:number

    approvedBy?:string
    aprovedAt?:Date
    createdAt?:Date
    updatedAt?:Date 
}
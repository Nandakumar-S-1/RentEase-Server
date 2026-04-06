export interface CreatePropertyDTO{
    ownerId:string
    title:string
    description:string
    propertyType:string
    
    locationDistrict:string,
    locationCity:string
    locationPinCode:string
    fullAddress:string

    monthlyRent:number
    depositAmount:number
    photos?:string[]
}
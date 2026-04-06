import { PropertyEntity } from "@core/entities/property.entity";
import { IBaseRepository } from "./base/base-repository.interface";

export interface IPropertyRepository extends IBaseRepository<PropertyEntity>{
    findById(id:string):Promise<PropertyEntity |null>
    findByOwnerId(ownerId:string):Promise<PropertyEntity[]>
    update(entity:PropertyEntity):Promise<PropertyEntity>
    delete(id:string):Promise<void>
    // search(filters:any):Promise<PropertyEntity[]>
    findPending():Promise<PropertyEntity[]>
}
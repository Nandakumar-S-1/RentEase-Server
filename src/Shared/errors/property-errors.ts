import { Http_StatusCodes } from "@shared/enums/http-status-codes.enum";
import { ProjectErrors } from "./base/base.error";

export class PropertyNotFoundError extends ProjectErrors{
    constructor(){
        super(Http_StatusCodes.NOT_FOUND, 'PROPERTY_NOTFOUND', 'Property not found')
    }
}
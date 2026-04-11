import { CreatePropertyResponseDTO } from "@application/dtos/property/res/create-property-response.dto";
import { PropertyEntity } from "@core/entities/property.entity";

export class PropertyResponseMapper{
    static toCreateResponse(entity:PropertyEntity):CreatePropertyResponseDTO{
        return{
            id:entity.id,
            title:entity.title,
            status:entity.status
        }
    }
}
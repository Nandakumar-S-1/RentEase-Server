import { CreatePropertyDTO } from "@application/dtos/property/property.dto";
import { CreatePropertyResponseDTO } from "@application/dtos/property/res/create-property-response.dto";

export interface ICreatePropertyUseCase{
    execute(dto:CreatePropertyDTO):Promise<CreatePropertyResponseDTO>
}
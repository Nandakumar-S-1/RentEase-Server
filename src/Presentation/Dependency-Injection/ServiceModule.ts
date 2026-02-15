import { IHashService } from "@infrastructure/Interfaces/IHashService";
import { BcryptHashService } from "@infrastructure/Services/BcryptHashService ";

import { container } from "tsyringe";

export class ServiceModule{
    static registerModues():void{
        container.register<IHashService>('IHashService',{
            useClass:BcryptHashService
        })
    }
}
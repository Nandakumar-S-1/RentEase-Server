import { Create_User_Usecase } from "@application/UseCases/Authentication/Register/CreateUser.usecase";
import { container } from "tsyringe";

export class UseCaseModule{
    static registerModules():void{
        container.register<Create_User_Usecase>('Create_User_Usecase',{
            useClass:Create_User_Usecase
        })
    }
}
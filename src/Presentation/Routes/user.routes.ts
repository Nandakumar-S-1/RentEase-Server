import { Create_User_Usecase } from "@application/UseCases/Authentication/Register/CreateUser.usecase";
import { UserRegisterController } from "@presentation/Controllers/Authentication/Register_user.controller";
import { Router } from "express";
import { container } from "tsyringe";


const router = Router()
//here for example the resolve asks DI container to give a fully created create user usecase with D's Injected.
// liike Create_User_Usecase needs IUserRepository. so it looks and register as userRepository..
const createUserUseCase = container.resolve(Create_User_Usecase)
const userRegisterController = new UserRegisterController(createUserUseCase)

router.post('/register', (req, res) => userRegisterController.register(req, res))
export default router
import { UserRole } from "Shared/Enums/user.role.type"

//it is Contracts for data crossing boundaries
//here dto has password while entity has hashedPass 

//dtos are objects that is like a contract for data crossing layers. 
//if the controler or any other outside layer wants to create a user , it does't need to know about the userEntity structure.

//another thing is dto represents what the frontend sends while entity is like what or hows data stored
//dto is like a bridge between frontend and backend

//seperation of concern is like changing internal data structre without affecting or breaking api or backwards.

export interface ICreateUserDTO {
    email: string
    fullname: string,
    password: string,
    phone: string,
    role: UserRole,
}


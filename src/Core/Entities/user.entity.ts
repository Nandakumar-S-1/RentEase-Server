import { UserTypeData } from 'Core/Types/user.types';
import { UserRole } from 'Shared/Enums/user.role.type';

export class UserEntity {
  private constructor(
    //private constructor prevents direct instantiation from outside the class
    //this is called factory method pattern
    // forces to use the static create method to create a new user
    private readonly _id: string,
    private _email: string,
    private _fullName: string,
    private _password: string,
    private _phone: string,
    private _role: UserRole,
    private _isActive: boolean = true,
    private _isSuspended: boolean = false,
    private _isEmailVerified: boolean = false,
    private _createdAt: Date,
  ) {}

  //this is the factory method that creates a new user
  static create(data: UserTypeData): UserEntity {
    return new UserEntity(
      data.id,
      data.email,
      data.fullname,
      data.passwordHash,
      data.phone,
      data.role,
      data.isActive ?? true,
      data.isSuspended ?? false,
      data.isEmailVerified ?? false,
      data.createdAt ?? new Date(),
    );
  }

  //We expose identity via a getter to preserve encapsulation while keeping it immutable
  get id() {
    //these are private fields , so get is used to expose it
    return this._id;
  }
  get email() {
    return this._email;
  }
  get fullname() {
    return this._fullName;
  }
  get password() {
    return this._password;
  }
  get phone() {
    return this._phone;
  }
  get role() {
    return this._role;
  }

  setEmailVerified():void{
    if(this._isEmailVerified){
      throw new Error('Email is already Verified')
    }
    this._isEmailVerified=true
  }
  deactivateUser():void{
    this._isActive=false
  }
  activateUser():void{
    this._isActive=true
  }
  suspendUser():void{
    this._isSuspended=true
  }
  unSuspendUser():void{
    this._isSuspended=false
  }
}

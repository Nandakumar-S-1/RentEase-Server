import { UserTypeData } from "Core/Types/user.types";
import { UserRole } from "Shared/Enums/user.role.type";

export class UserEntity {
  private constructor(
    private readonly _id: string,
    private _email: string,
    private _fullName: string,
    private _password: string,
    private _phone: string,
    private _role: UserRole,
    private _isActive: boolean = true,
    private _isSuspended: boolean = false,
    private _isEmailVerified: boolean = false,
    private _createdAt: Date ,
  ) {}

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
      data.createdAt ?? new Date()
    );
  }

  //We expose identity via a getter to preserve encapsulation while keeping it immutable
  get id() {
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
}

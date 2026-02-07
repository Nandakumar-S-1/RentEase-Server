
//this is abstraction .Use case is depended on this .
//also this base repository defines common operations like [create] and IUserRepository  extends it to add user-specific operations like 
// [findByEmail] This is the O in SOLID (open-closed principle) the base interface is open for extension but closed for modification.
export interface IBaseRepository<T> {
    create(entity: T): Promise<T>;
}
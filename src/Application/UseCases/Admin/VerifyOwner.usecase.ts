import { TokenTypes } from "@shared/Types/tokens";
import { inject, injectable } from "tsyringe";

injectable()
export class VerifyOwnerUseCase{
    constructor(
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepository: IOwnerProfileRepository
    ){}
}
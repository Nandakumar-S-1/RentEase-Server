import { ITokenPayloadContent, ITokenTypes } from "./Token-Interfaces/ITokenPayloadContent";

export interface IJwtService{
    createTokenPair(payload:ITokenPayloadContent):ITokenTypes
    verifyTheAccessToken(token:string):ITokenPayloadContent
    verifyTheRefreshToken(token:string):ITokenPayloadContent
}
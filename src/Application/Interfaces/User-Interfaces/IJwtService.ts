import { ITokenPayloadContent, ITokenTypes } from "./Token-Interfaces/ITokenPayloadContent";

export interface IJwtService{
    // createAccessToken(payload:ITokenPayloadContent):string
    // createRefreshToken(payload:ITokenPayloadContent):string
    createPairofJwtTokens(payload:ITokenPayloadContent):ITokenTypes
    verifyTheAccessToken(token:string):ITokenPayloadContent
    verifyTheRefreshToken(token:string):ITokenPayloadContent
}
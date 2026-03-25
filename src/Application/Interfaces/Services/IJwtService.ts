import { ITokenPayloadContent, ITokenTypes } from '../Security/ITokenPayloadContent';

export interface IJwtService {
    createPairofJwtTokens(payload: ITokenPayloadContent): ITokenTypes;
    verifyTheAccessToken(token: string): ITokenPayloadContent;
    verifyTheRefreshToken(token: string): ITokenPayloadContent;
}

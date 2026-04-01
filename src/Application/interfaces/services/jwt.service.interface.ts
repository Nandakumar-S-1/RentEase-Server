import { ITokenPayloadContent, ITokenTypes } from '../security/token.types';

export interface IJwtService {
    createPairofJwtTokens(payload: ITokenPayloadContent): ITokenTypes;
    verifyTheAccessToken(token: string): ITokenPayloadContent;
    verifyTheRefreshToken(token: string): ITokenPayloadContent;
}

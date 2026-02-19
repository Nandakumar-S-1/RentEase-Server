import { IJwtService } from "@application/Interfaces/User-Interfaces/IJwtService";
import { ITokenPayloadContent, ITokenTypes } from "@application/Interfaces/User-Interfaces/Token-Interfaces/ITokenPayloadContent";
import { injectable } from "tsyringe";
import jwt, { SignOptions } from "jsonwebtoken"
import { logger } from "@shared/Log/logger";
import { accessTokenCreationError, InvalidAccessToken, InvalidRefreshToken, refreshTOkenCreationError } from "@shared/Errors/JWT_Errors";

@injectable()
export class JwtService implements IJwtService{
    private readonly accessTokenSecret :string
    private readonly refreshTokenSecret :string
    private readonly accessTokenExpiry
    private readonly refreshTokenExpiry 

    constructor(){
        if(!process.env.JWT_ACCESS_TOKEN_SECRET){
            throw new Error('JWT_ACCESS_TOKEN_SECRET is missing')
        }
        if(!process.env.JWT_REFRESH_TOKEN_SECRET){
            throw new Error('JWT_REFRESH_TOKEN_SECRET is missing')
        }
        if(!process.env.JWT_ACCESS_TOKEN_EXPIRY){
            throw new Error('JWT_ACCESS_TOKEN_EXPIRY is missing')
        }
        if(!process.env.JWT_REFRESH_TOKEN_EXPIRY){
            throw new Error('JWT_REFRESH_TOKEN_EXPIRY is missing')
        }

        this.accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
        this.refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET
        this.accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] 
        this.refreshTokenExpiry = process.env.JWT_REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] 
    }

    private createAccessToken(payload:ITokenPayloadContent):string {
        try {
            const signOptions:SignOptions={
                expiresIn:this.accessTokenExpiry ,
                algorithm:"HS256"
            }
            const token =  jwt.sign(payload,this.accessTokenSecret,signOptions)
            
            logger.info(`access token for user id:${payload.userId}`)
            return token

        } catch (error) {
            logger.error({error},'error creating access token')
            throw new accessTokenCreationError()
        }
    }

    private createRefreshToken(payload:ITokenPayloadContent):string{
        try {

            const signOptions :SignOptions={
                expiresIn:this.refreshTokenExpiry,
                algorithm:"HS256"
            } 

            const token = jwt.sign(payload,this.refreshTokenSecret,signOptions)

            logger.info(`refreshtoken for ${payload.userId} created`)
            return token
        } catch (error) {
            logger.error({error},'failed creating thee refreshtokn')
            throw new refreshTOkenCreationError()
        }
    }

    createPairofJwtTokens(payload:ITokenPayloadContent):ITokenTypes{
        try {
            const accessToken = this.createAccessToken(payload)
            const refreshToken = this.createRefreshToken(payload)
            
            logger.info('token pair created')
            return {
                accessToken,refreshToken
            }
        } catch (error) {
            logger.error({error},'token creation has failed')
            throw new Error("JWT pair creation failed")
        }
    }

    verifyTheAccessToken(token: string): ITokenPayloadContent {
        try {
            const decoded = jwt.verify(token,this.accessTokenSecret) as ITokenPayloadContent
            logger.info(`${decoded.userId}'s access token verified`)
            return decoded
        } catch (error) {
            logger.warn({error},' access token verification error')
            throw new InvalidAccessToken()
        }
    }

    verifyTheRefreshToken(token: string): ITokenPayloadContent {
        try {
            const decoded = jwt.verify(token,this.refreshTokenSecret)  as ITokenPayloadContent
            logger.info(`${decoded.userId}' s refresh token has verified`)
        
            return decoded
        } catch (error) {
            logger.warn({error},`Refresh token verification failed:`);
            throw new InvalidRefreshToken()
        }
    }

    
}
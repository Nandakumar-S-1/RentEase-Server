export interface IRefreshTokenUseCase{
    execute(refreshToken:string):Promise<{
        accessToken:string;
        refreshToken:string
    }>
}
import { IJwtService } from "@application/Interfaces/User-Interfaces/IJwtService";
import { injectable } from "tsyringe";

@injectable()
export class JwtService implements IJwtService{
    private readonly accessTokenSecret = process.
}
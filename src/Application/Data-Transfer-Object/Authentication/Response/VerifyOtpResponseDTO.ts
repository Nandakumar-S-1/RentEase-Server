import { UserEntity } from '@core/Entities/user.entity';

//this is gonna return
export interface VerifyOtpResponseDTO {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
}

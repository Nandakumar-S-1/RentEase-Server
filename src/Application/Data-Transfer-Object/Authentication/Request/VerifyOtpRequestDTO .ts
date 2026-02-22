//when the user tries to verifuy their otp,user send email and otp
//this is what client sends

export interface IVerifyOtpRequestDTO {
  email: string;
  otp: string;
}

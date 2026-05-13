export interface VerifyOtpRequest {
  userId: string;
  otp: string;
} 
   
   
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  verified: boolean;
}
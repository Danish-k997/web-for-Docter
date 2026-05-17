export interface VerifyOtpRequest {
  userId: string;
  otp: string;
} 
   
   
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    role: string;
    verified: boolean;
  };
  accessToken: string;
  
}